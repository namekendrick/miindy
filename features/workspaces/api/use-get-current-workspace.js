import { useQuery } from "@tanstack/react-query";

import { getWorkspaceById } from "@/db/workspace";

export const useGetCurrentWorkspace = (id) => {
  const { data, isLoading } = useQuery({
    queryKey: ["workspace", id],
    queryFn: () => {
      return getWorkspaceById(id);
    },
  });

  return { data, isLoading };
};
