import { useQuery } from "@tanstack/react-query";

import { getCurrentUsersWorkspaces } from "@/db/workspace";

export const useGetWorkspaces = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: () => {
      return getCurrentUsersWorkspaces();
    },
  });

  return { data, isLoading };
};
