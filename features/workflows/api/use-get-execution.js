import { useQuery } from "@tanstack/react-query";

import { getWorkflowExecutionWithPhases } from "@/db/executions";

export const useGetExecution = (values, options = {}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["execution", values.executionId],
    queryFn: () => {
      return getWorkflowExecutionWithPhases(values);
    },
    ...options,
  });

  return { data, isLoading };
};
