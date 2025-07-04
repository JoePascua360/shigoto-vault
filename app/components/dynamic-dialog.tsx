import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type React from "react";

interface DynamicDialogProps<TDialog> {
  children: React.ReactElement;
  triggerElement?: React.ReactElement;
  dialog: TDialog;
  title?: string;
  description?: string;
}

export default function DynamicDialog<TDialog>({
  children,
  triggerElement,
  dialog,
  title = "",
  description = "",
}: DynamicDialogProps<TDialog>) {
  return (
    <Dialog {...dialog}>
      {triggerElement && (
        <DialogTrigger className="font-content" asChild>
          {triggerElement}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-secondary-header">{title}</DialogTitle>
          <DialogDescription className="font-content">
            {description}
          </DialogDescription>
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
