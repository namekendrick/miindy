"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Modal = ({ title, description, isOpen, onClose, children }) => {
  const onChange = (open) => {
    if (!open) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent
        className={cn(
          "overflow-y-auto sm:max-h-[600px]",
          window.innerWidth <= 500 && "mt-[200px] h-full place-content-start",
        )}
      >
        <DialogHeader>
          <DialogTitle className="line-clamp-1 text-left text-xl font-bold sm:text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="w-full overflow-hidden">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
