import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipWrapperProps {
  children: React.ReactElement;
  /**
   * @param content -  text explaining the function of the children component
   */
  content: string;
  /**
   * @param delay - tooltip delay before showing it to the user (optional)
   */
  delay?: number;
}

export default function TooltipWrapper({
  children,
  content,
  delay = 700,
}: TooltipWrapperProps) {
  return (
    <Tooltip delayDuration={delay}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p className="font-sub-text text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
