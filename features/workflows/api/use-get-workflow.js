import { useQuery } from "@tanstack/react-query";

import { getWorkflowPhaseDetails } from "@/db/executions";
import { getWorkflowById } from "@/db/workflows";

export const useGetWorkflow = (values) => {
  const { data, isLoading } = useQuery({
    queryKey: ["workflow", values.workflowId],
    queryFn: () => {
      return getWorkflowById(values);
    },
  });

  return { data, isLoading };
};

export const useGetWorkflowPhaseDetails = (values) => {
  const { data, isLoading } = useQuery({
    queryKey: ["phaseDetails", values.selectedPhase, values.execution.status],
    enabled: values.selectedPhase !== null,
    queryFn: () => {
      return getWorkflowPhaseDetails(values);
    },
  });

  return { data, isLoading };
};
