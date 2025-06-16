import { Calendar } from "@/components/ui/calendar";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";

export function DatePicker() {
  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar
          mode="single"
          selected={new Date()}
          className="rounded-md border shadow-sm"
          captionLayout="dropdown"
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
