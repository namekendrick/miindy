"use client";

import { useQuery } from "@tanstack/react-query";
import { getEnabledObjects } from "@/db/objects";
import { generateObjectNavigation } from "@/features/objects/utils/navigation";

export const useGetObjectNavigation = (workspaceId) => {
  return useQuery({
    queryKey: ["object-navigation", workspaceId],
    queryFn: () => getEnabledObjects(workspaceId),
    select: (objects) => {
      if (objects?.status) return [];
      return generateObjectNavigation(objects);
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
