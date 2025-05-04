import { useQuery } from "@tanstack/react-query";

import { getRelatedRecords } from "@/db/record";

export const useGetRelatedRecords = (values) => {
  const { data, isLoading } = useQuery({
    queryKey: ["related-records", { ...values }],
    queryFn: () => {
      return getRelatedRecords(values);
    },
  });

  return { data, isLoading };
};
