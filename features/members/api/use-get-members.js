import { useQuery } from "@tanstack/react-query";

import { getWorkspaceMembers } from "@/db/workspace";

export const useGetWorkspaceMembers = (id, page) => {
  const { data, isLoading } = useQuery({
    queryKey: ["members", id, page],
    queryFn: () => {
      return getWorkspaceMembers(id, page);
    },
  });

  return { data, isLoading };
};
