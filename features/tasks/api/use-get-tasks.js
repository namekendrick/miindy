import { useQuery } from "@tanstack/react-query";

import { getTasks } from "@/db/task";

export const useGetTasks = (workspaceId) => {
  return useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: () => getTasks(workspaceId),
    enabled: !!workspaceId,
  });
};
