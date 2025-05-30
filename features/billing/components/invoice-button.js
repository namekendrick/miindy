"use client";

import { FileIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDownloadInvoice } from "@/features/billing/api/use-download-invoice";

export const InvoiceButton = ({ id, workspaceId }) => {
  const { mutate: downloadInvoice, isPending } = useDownloadInvoice();

  const handleDownloadInvoice = () => {
    downloadInvoice({ id, workspaceId });
  };

  return (
    <Button
      variant="link"
      size="sm"
      className="text-muted-foreground hover:text-primary cursor-pointer"
      disabled={isPending}
      onClick={handleDownloadInvoice}
    >
      <FileIcon className="h-4 w-4" />
    </Button>
  );
};
