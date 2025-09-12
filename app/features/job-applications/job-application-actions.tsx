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
import { Clipboard, ListCheck, MoreHorizontal, Trash2 } from "lucide-react";
import type { Row, Table } from "@tanstack/react-table";
import { type JobApplicationsColumn } from "./job-application-columns";
import UpdateJobApplicationStatus from "@/components/form/features/job-applications/update-job-application-status";
import { Button } from "@/components/ui/button";
import DeleteJobApplication from "@/components/form/features/job-applications/delete-job-application";
import type { UpdateAndDeleteInterface } from "@/types/features/job-application/update-and-delete-interface";
import { useDialog } from "@/hooks/use-dialog";
import type { QueryClient } from "@tanstack/react-query";

interface JobApplicationActionsProps extends UpdateAndDeleteInterface {
  queryClient: QueryClient;
}

export default function JobApplicationActions({
  table,
  row,
  queryClient,
}: JobApplicationActionsProps) {
  const jobAppID = row.original.job_app_id;

  const deleteDialog = useDialog();

  return (
    <>
      {/* dialog for delete job application */}
      <DeleteJobApplication
        row={row}
        table={table}
        queryClient={queryClient}
        dialog={deleteDialog}
      />

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

          {/* Update job application status  */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 flex gap-2">
              <ListCheck />
              Set Status
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <UpdateJobApplicationStatus
                  row={row}
                  table={table}
                  queryClient={queryClient}
                />
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={() => deleteDialog.trigger()}
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </>
      </DropdownMenuComponent>
    </>
  );
}
