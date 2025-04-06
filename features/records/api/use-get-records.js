import { useQuery } from "@tanstack/react-query";

import { getRecords } from "@/db/record";

export const useGetRecords = (values) => {
  const { data, isLoading } = useQuery({
    queryKey: [{ ...values }],
    queryFn: () => {
      return getRecords(values);
    },
  });

  return { data, isLoading };
};
