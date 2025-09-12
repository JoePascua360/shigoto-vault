import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { DialogType } from "@/hooks/use-dialog";
import type React from "react";

interface DynamicDialogProps {
  children: React.ReactElement;
  triggerElement?: React.ReactElement;
  dialog: DialogType;
  title?: string;
  description?: string;
  className?: string;
}

export default function DynamicDialog({
  children,
  triggerElement,
  dialog,
  title = "",
  description = "",
  className = "",
}: DynamicDialogProps) {
  return (
    <Dialog {...dialog.dialogProps}>
      {triggerElement && (
        <DialogTrigger className="font-content" asChild>
          {triggerElement}
        </DialogTrigger>
      )}
      <DialogContent className={className}>
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
