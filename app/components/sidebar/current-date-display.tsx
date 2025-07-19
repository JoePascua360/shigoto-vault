import { Calendar } from "@/components/ui/calendar";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";

export function DatePicker() {
  return (
    <SidebarGroup className="px-4 md:px-1">
      <SidebarGroupContent>
        <Calendar
          mode="single"
          className="rounded-md border shadow-sm "
          selected={new Date()}
          // return null, calendar is only for display
          onSelect={() => null}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
