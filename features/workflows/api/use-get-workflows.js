import { useQuery } from "@tanstack/react-query";

import { getWorkflowsByWorkspaceId } from "@/db/workflows";

export const useGetWorkflows = (workspaceId) => {
  const { data, isLoading } = useQuery({
    queryKey: ["workflows", workspaceId],
    queryFn: () => {
      return getWorkflowsByWorkspaceId(workspaceId);
    },
  });

  return { data, isLoading };
};
