import { useState } from "react";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import DropdownMenuComponent from "@/components/dropdown-component";
import { showToast } from "@/utils/show-toast";
import {
  Clipboard,
  ListCheck,
  MoreHorizontal,
} from "lucide-react";
import type { Row, Table } from "@tanstack/react-table";
import {
  type JobApplicationsColumn,
} from "./job-application-columns";
import { fetchRequestComponent } from "@/utils/fetch-request-component";
import { useQueryClient } from "@tanstack/react-query";
import UpdateJobApplicationStatus from "@/components/form/update-job-application-status";

interface UpdateMultipleJobApplicationProps {
  table: Table<JobApplicationsColumn>;
  row: Row<JobApplicationsColumn>;
}

export default function UpdateMultipleJobApplication({
  table,
  row,
}: UpdateMultipleJobApplicationProps) {
  const jobAppID = row.original.job_app_id;

  return (
    <DropdownMenuComponent
      icon={<MoreHorizontal />}
      contentAlignment="start"
      triggerConfig={{ variant: "ghost", size: "icon" }}
      triggerTitle="Click to show options"
      className="min-w-[12rem]"
    >
      <>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(jobAppID);
            showToast("success", "Job ID copied successfully!", 1000);
          }}
        >
          <Clipboard />
          Copy Job ID
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 flex gap-2">
            <ListCheck />
            Set Status
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <UpdateJobApplicationStatus row={row} table={table} />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </>
    </DropdownMenuComponent>
  );
}
