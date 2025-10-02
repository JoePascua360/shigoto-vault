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
  /**
   * dialog's body content
   */
  children: React.ReactElement;
  /**
   * dialog object that contain controls such as trigger/dismiss to open/close the dialog
   */
  dialog: DialogType;
  /**
   * Any react element that triggers the dialog to open
   */
  triggerElement?: React.ReactElement;
  /**
   * Title header for dialog
   */
  title?: string;
  /**
   * Description about the dialog
   */
  description?: string;
  /**
   * Add custom classNames to dialog content. Customize 'sm:max-w-lg' class to modify the width of dialog
   */
  className?: string;
  /**
   * Default value is true. Make this value false if you want to prevent the dialog from closing when you click outside of it.
   */
  closeOnClickOutside?: boolean;
}

/**
 * Dialog component that can be customized depending on the page/section content.
 */
export default function DynamicDialog({
  children,
  triggerElement,
  dialog,
  title = "",
  description = "",
  className = "",
  closeOnClickOutside = true,
}: DynamicDialogProps) {
  return (
    <Dialog {...dialog.dialogProps}>
      {triggerElement && (
        <DialogTrigger className="font-content" asChild>
          {triggerElement}
        </DialogTrigger>
      )}
      <DialogContent
        className={className}
        onInteractOutside={(e) =>
          closeOnClickOutside ? null : e.preventDefault()
        }
      >
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
