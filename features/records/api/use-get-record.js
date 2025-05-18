import { useQuery } from "@tanstack/react-query";

import { getRecordById } from "@/db/record";

export const useGetRecord = (values) => {
  return useQuery({
    queryKey: ["record", values],
    queryFn: () => getRecordById(values),
  });
};
