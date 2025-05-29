import { useQuery } from "@tanstack/react-query";

import { getUserCredentials } from "@/db/credentials";

export const useGetUserCredentials = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-credentials"],
    queryFn: () => {
      return getUserCredentials();
    },
    refetchInterval: 10000,
  });

  return { data, isLoading };
};
