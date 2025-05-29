import { useQuery } from "@tanstack/react-query";

import { getExecutionsByWorkflowId } from "@/db/executions";

export const useGetExecutions = (values, options = {}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["executions", values.workflowId],
    queryFn: () => {
      return getExecutionsByWorkflowId(values);
    },
    ...options,
  });

  return { data, isLoading };
};
