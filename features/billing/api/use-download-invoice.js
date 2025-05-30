import { useMutation, useQueryClient } from "@tanstack/react-query";

import { downloadInvoice } from "@/features/billing/server/download-invoice";
import { toast } from "sonner";

export const useDownloadInvoice = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) => {
      const response = downloadInvoice(values);

      toast.promise(response, {
        loading: "Downloading invoice...",
        error: (error) => error.message,
      });

      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries();
      window.open(response, "_blank");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return mutation;
};
