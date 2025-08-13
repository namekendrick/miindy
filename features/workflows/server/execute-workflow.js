import prisma from "@/lib/prisma";
import {
  EXECUTOR_REGISTRY,
  TASK_REGISTRY,
} from "@/features/workflows/constants/registry";
import { createLogCollector } from "@/features/workflows/utils/create-log-collector";
import { resolvePhaseInputs } from "@/features/workflows/utils/variable-resolver";

export const executeWorkflow = async (executionId, nextRunAt) => {
  try {
    const execution = await prisma.workflowExecution.findUnique({
      where: { id: executionId },
      include: { workflow: true, phases: true },
    });

    if (!execution) return { status: 404, message: "Execution not found!" };

    const workspaceId = execution.workflow.workspaceId;

    const edges = JSON.parse(execution.definition).edges;

    const environment = { phases: {} };

    await initializeWorkflowExecution(
      executionId,
      execution.workflowId,
      nextRunAt,
    );

    await initializePhaseStatuses(execution);

    let creditsConsumed = 0;
    let executionFailed = false;
    let failureReason = null;

    for (const phase of execution.phases) {
      try {
        const phaseExecution = await executeWorkflowPhase(
          phase,
          environment,
          edges,
          workspaceId,
        );

        creditsConsumed += phaseExecution.creditsConsumed;

        if (!phaseExecution.success) {
          executionFailed = true;
          failureReason = `Phase ${phase.id} failed`;
          break;
        }
      } catch (error) {
        console.error(`Phase execution error for phase ${phase.id}:`, error);
        executionFailed = true;
        failureReason = `Phase ${phase.id} crashed: ${error.message}`;
        break;
      }
    }

    await finalizeWorkflowExecution(
      executionId,
      execution.workflowId,
      executionFailed,
      creditsConsumed,
      failureReason,
    );

    await cleanupEnvironment(environment);

    return {
      status: executionFailed ? 500 : 200,
      message: executionFailed
        ? failureReason
        : "Workflow completed successfully",
      creditsConsumed,
    };
  } catch (error) {
    console.error(`Workflow execution error for ${executionId}:`, error);

    try {
      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
          status: "FAILED",
          completedAt: new Date(),
        },
      });
    } catch (updateError) {
      console.error(`Failed to update execution status:`, updateError);
    }

    return {
      status: 500,
      message: `Workflow execution failed: ${error.message}`,
    };
  }
};

const initializeWorkflowExecution = async (
  executionId,
  workflowId,
  nextRunAt,
) => {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: "RUNNING",
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: "RUNNING",
      lastRunId: executionId,
      ...(nextRunAt && { nextRunAt }),
    },
  });
};

const initializePhaseStatuses = async (execution) => {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase) => phase.id),
      },
    },
    data: {
      status: "PENDING",
    },
  });
};

const finalizeWorkflowExecution = async (
  executionId,
  workflowId,
  executionFailed,
  creditsConsumed,
  failureReason = null,
) => {
  const finalStatus = executionFailed ? "FAILED" : "COMPLETED";

  const updateData = {
    status: finalStatus,
    completedAt: new Date(),
    creditsConsumed,
  };

  if (executionFailed && failureReason) {
    updateData.failureReason = failureReason;
  }

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: updateData,
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
      lastRunId: executionId,
    },
    data: {
      lastRunStatus: finalStatus,
    },
  });
};

const executeWorkflowPhase = async (phase, environment, edges, workspaceId) => {
  const logCollector = createLogCollector();
  const startedAt = new Date();
  const node = JSON.parse(phase.node);

  setupEnvironmentForPhase(node, environment, edges);

  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: "RUNNING",
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const creditsRequired = TASK_REGISTRY[node.data.type].credits;

  let success = await decrementCredits(
    workspaceId,
    creditsRequired,
    logCollector,
  );

  const creditsConsumed = success ? creditsRequired : 0;

  if (success) success = await executePhase(node, environment, logCollector);

  const outputs = environment.phases[node.id].outputs;

  await finalizePhase(
    phase.id,
    success,
    outputs,
    logCollector,
    creditsConsumed,
  );

  return { success, creditsConsumed };
};

const finalizePhase = async (
  phaseId,
  success,
  outputs,
  logCollector,
  creditsConsumed,
) => {
  const finalStatus = success ? "COMPLETED" : "FAILED";

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            timestamp: log.timestamp,
            logLevel: log.level,
          })),
        },
      },
    },
  });
};

const executePhase = async (node, environment, logCollector) => {
  const runFn = EXECUTOR_REGISTRY[node.data.type];

  if (!runFn) {
    logCollector.error(`Executor not found for task type: ${node.data.type}`);
    return false;
  }

  const executionEnvironment = createExecutionEnvironment(
    node,
    environment,
    logCollector,
  );

  return await runFn(executionEnvironment);
};

const setupEnvironmentForPhase = (node, environment, edges) => {
  environment.phases[node.id] = { inputs: {}, outputs: {} };

  const taskInputs = TASK_REGISTRY[node.data.type].inputs;

  const resolvedInputs = resolvePhaseInputs(
    node,
    environment,
    edges,
    taskInputs,
  );
  environment.phases[node.id].inputs = resolvedInputs;
};

const createExecutionEnvironment = (node, environment, logCollector) => {
  return {
    getInput: (name) => environment.phases[node.id]?.inputs[name],
    setOutput: (name, value) => {
      environment.phases[node.id].outputs[name] = value;
    },
    getBrowser: () => environment.browser,
    setBrowser: (browser) => (environment.browser = browser),
    getPage: () => environment.page,
    setPage: (page) => (environment.page = page),

    log: logCollector,
  };
};

const cleanupEnvironment = async (environment) => {
  if (environment.browser) {
    await environment.browser
      .close()
      .catch((err) => console.error("Cannot close browser - ", err));
  }
};

const decrementCredits = async (workspaceId, amount, logCollector) => {
  try {
    await prisma.workspaceBalance.update({
      where: { workspaceId, credits: { gte: amount } },
      data: { credits: { decrement: amount } },
    });
    return true;
  } catch (error) {
    logCollector.error("Insufficient balance");
    return false;
  }
};
