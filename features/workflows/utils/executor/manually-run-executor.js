import {
  createStandardExecutor,
  handleExecutorSuccess,
} from "@/features/workflows/utils/error-handling";

const manuallyRunExecutorFn = async (environment) => {
  return handleExecutorSuccess(
    environment,
    { "Flow started": true },
    "Workflow manually triggered",
  );
};

export const ManuallyRunExecutor = createStandardExecutor(
  manuallyRunExecutorFn,
  {
    name: "Manual Trigger",
    requiredInputs: [],
  },
);
