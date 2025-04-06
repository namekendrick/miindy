import { useQuery } from "@tanstack/react-query";

import { getWorkspaceObjects } from "@/db/workspace";

export const useGetObjects = (id) => {
  const { data, isLoading } = useQuery({
    queryKey: ["objects", id],
    queryFn: () => {
      return getWorkspaceObjects(id);
    },
  });

  return { data, isLoading };
};
