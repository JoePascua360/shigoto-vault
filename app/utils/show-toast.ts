import { toast } from "sonner";

type ToastType = "success" | "info" | "warning" | "error" | "message";

type showToastParams = {
  label: string;
  onClick: () => void;
};

export function showToast(
  type: ToastType,
  message: string,
  duration = 4000,
  action?: showToastParams
) {
  return toast[type](message, {
    action: action,
    duration: duration,
  });
}
