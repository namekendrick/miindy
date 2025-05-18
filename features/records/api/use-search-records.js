import { useQuery } from "@tanstack/react-query";
import { searchRecords } from "@/db/record";

export const useSearchRecords = (values, options = {}) => {
  return useQuery({
    queryKey: ["search-records", { ...values }],
    queryFn: () => searchRecords(values),
    ...options,
  });
};
