"use client";

import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  WorkflowIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { ReactCountUpWrapper } from "@/components/react-count-up-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetExecution } from "@/features/workflows/api/use-get-execution";
import { useGetWorkflowPhaseDetails } from "@/features/workflows/api/use-get-workflow";
import { PhaseStatusBadge } from "@/features/workflows/components/phase-status-badge";
import { getPhasesTotalCost } from "@/features/workflows/utils/get-phases-total-cost";
import { DatesToDurationString } from "@/lib/utils/dates";
import { cn } from "@/lib/utils";

export const ExecutionViewer = ({ workflowId, initialData }) => {
  const [selectedPhase, setSelectedPhase] = useState(null);

  const { data: execution } = useGetExecution(
    {
      workflowId,
      executionId: initialData.id,
    },
    {
      initialData,
      refetchInterval: (q) =>
        q.state.data?.status === "RUNNING" ? 1000 : false,
    },
  );

  const { data: phaseDetails } = useGetWorkflowPhaseDetails({
    execution,
    selectedPhase,
    workflowId,
  });

  const isRunning = execution?.status === "RUNNING";

  useEffect(() => {
    // While running we auto-select the current running phase in the sidebar
    const phases = execution?.phases || [];

    if (isRunning) {
      // Select the last executed phase
      const phaseToSelect = phases.toSorted((a, b) =>
        a.startedAt > b.startedAt ? -1 : 1,
      )[0];

      setSelectedPhase(phaseToSelect.id);
      return;
    }

    const phaseToSelect = phases.toSorted((a, b) =>
      a.completedAt > b.completedAt ? -1 : 1,
    )[0];

    setSelectedPhase(phaseToSelect.id);
  }, [execution?.phases, isRunning, setSelectedPhase]);

  const duration = DatesToDurationString(
    execution?.completedAt,
    execution?.startedAt,
  );

  const creditsConsumed = getPhasesTotalCost(execution?.phases || []);

  if (!execution || !phaseDetails) return null;

  return (
    <div className="flex h-full w-full">
      <aside className="flex w-[440px] max-w-[440px] min-w-[440px] flex-grow border-separate flex-col overflow-hidden border-r-2">
        <div className="px-2 py-4">
          <ExecutionLabel
            icon={CircleDashedIcon}
            label="Status"
            value={
              <div className="flex items-center gap-2 font-semibold capitalize">
                <PhaseStatusBadge status={execution?.status} />
                <span>{execution?.status}</span>
              </div>
            }
          />
          <ExecutionLabel
            icon={CalendarIcon}
            label="Started at"
            value={
              <span className="lowercase">
                {execution?.startedAt
                  ? formatDistanceToNow(new Date(execution?.startedAt), {
                      addSuffix: true,
                    })
                  : "-"}
              </span>
            }
          />
          <ExecutionLabel
            icon={ClockIcon}
            label="Duration"
            value={
              duration ? (
                duration
              ) : (
                <Loader2Icon className="animate-spin" size={20} />
              )
            }
          />
          <ExecutionLabel
            icon={CoinsIcon}
            label="Credits consumed"
            value={<ReactCountUpWrapper value={creditsConsumed} />}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-center px-4 py-2">
          <div className="text-muted-foreground flex items-center gap-2">
            <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
            <span className="font-semibold">Phases</span>
          </div>
        </div>
        <Separator />
        <div className="h-full overflow-auto px-2 py-4">
          {execution?.phases.map((phase, index) => (
            <Button
              key={phase.id}
              className="w-full justify-between"
              variant={selectedPhase === phase.id ? "secondary" : "ghost"}
              onClick={() => {
                if (isRunning) return;
                setSelectedPhase(phase.id);
              }}
            >
              <div className="flex items-center gap-2">
                <Badge variant={"outline"}>{index + 1}</Badge>
                <p className="font-semibold">{phase.name}</p>
              </div>
              <PhaseStatusBadge status={phase.status} />
            </Button>
          ))}
        </div>
      </aside>
      <div className="flex h-full w-full">
        {isRunning && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <p className="font-bold">Run is in progress, please wait</p>
          </div>
        )}
        {!isRunning && !selectedPhase && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <div className="flex flex-col gap-1 text-center">
              <p className="font-bold">No phase selected</p>
              <p className="text-muted-foreground text-sm">
                Select a phase to view details
              </p>
            </div>
          </div>
        )}
        {!isRunning && selectedPhase && phaseDetails && (
          <div className="flex w-full flex-col gap-4 overflow-auto p-4">
            <div className="flex items-center gap-2">
              <Badge
                variant={"outline"}
                className="flex items-center gap-3 p-2"
              >
                <div className="flex items-center gap-1">
                  <CoinsIcon size={15} className="stroke-muted-foreground" />
                  <span>Credits</span>
                </div>
                <span>{phaseDetails.creditsConsumed}</span>
              </Badge>
              <Badge
                variant={"outline"}
                className="flex items-center gap-3 p-2"
              >
                <div className="flex items-center gap-1">
                  <ClockIcon size={15} className="stroke-muted-foreground" />
                  <span>Duration</span>
                </div>
                <span>
                  {DatesToDurationString(
                    phaseDetails.completedAt,
                    phaseDetails.startedAt,
                  ) || "-"}
                </span>
              </Badge>
            </div>

            <ParamaterViewer
              title="Inputs"
              subTitle="Inputs used for this phase"
              paramsJson={phaseDetails.inputs}
            />

            <ParamaterViewer
              title="Outputs"
              subTitle="Outputs generated by this phase"
              paramsJson={phaseDetails.outputs}
            />

            <LogViewer logs={phaseDetails.logs} />
          </div>
        )}
      </div>
    </div>
  );
};

const ExecutionLabel = ({ icon, label, value }) => {
  const Icon = icon;
  return (
    <div className="flex items-center justify-between px-4 py-2 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon size={20} className="stroke-muted-foreground/80" />
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2 font-semibold capitalize">
        {value}
      </div>
    </div>
  );
};

const ParamaterViewer = ({ title, subTitle, paramsJson }) => {
  const params = paramsJson ? JSON.parse(paramsJson) : undefined;
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="dark:bg-background rounded-xl rounded-b-none border-b bg-gray-50 py-4">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {subTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="gap2 flex flex-col">
          {(!params || Object.keys(params).length === 0) && (
            <p className="text-sm">No parameters generated by this phase</p>
          )}
          {params &&
            Object.entries(params).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between space-y-1"
              >
                <p className="text-muted-foreground flex-1 basis-1/3 text-sm">
                  {key}
                </p>
                <Input readOnly className="flex-1 basis-2/3" value={value} />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

const LogViewer = ({ logs }) => {
  if (!logs || logs.length === 0) return null;
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="dark:bg-background rounded-xl rounded-b-none border-b bg-gray-50 py-4">
        <CardTitle className="text-base">Logs</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Logs generated by this phase
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="text-muted-foreground text-sm">
            <TableRow>
              <TableHead className="px-6">Time</TableHead>
              <TableHead className="px-6">Level</TableHead>
              <TableHead className="px-6">Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="text-muted-foreground">
                <TableCell
                  width={190}
                  className="text-muted-foreground pl-6 text-xs"
                >
                  {log.timestamp.toISOString()}
                </TableCell>
                <TableCell
                  width={80}
                  className={cn(
                    "pl-6 text-xs font-bold uppercase",
                    log.logLevel === "error" && "text-destructive",
                    log.logLevel === "info" && "text-primary",
                  )}
                >
                  {log.logLevel}
                </TableCell>
                <TableCell className="flex-1 pl-6 text-sm">
                  {log.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
