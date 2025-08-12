import { useQuery } from "@tanstack/react-query";

import { getObjectAttributes } from "@/db/record";

export const useGetObjectAttributes = (
  workspaceId,
  objectType,
  options = {},
) => {
  return useQuery({
    queryKey: ["object-attributes", workspaceId, objectType],
    queryFn: () => getObjectAttributes(workspaceId, objectType),
    enabled: !!workspaceId && !!objectType,
    ...options,
  });
};
