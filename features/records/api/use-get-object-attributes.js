import { useQuery } from "@tanstack/react-query";

import { getObjectAttributes } from "@/db/record";

export const useGetObjectAttributes = (workspaceId, objectType) => {
  const { data, isLoading } = useQuery({
    queryKey: ["objectAttributes", workspaceId, objectType],
    queryFn: () => {
      return getObjectAttributes(workspaceId, objectType);
    },
    staleTime: 0,
  });

  return { data, isLoading };
};
