import { useQuery } from "@tanstack/react-query";

import { searchRecords } from "@/db/record";

export const useSearchRecords = (values, options = {}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["search-records", { ...values }],
    queryFn: () => {
      return searchRecords(values);
    },
    enabled: !!values.searchTerm,
    ...options,
  });

  return { data, isLoading };
};
