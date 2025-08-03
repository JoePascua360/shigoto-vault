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
  SortAscIcon,
} from "lucide-react";
import type { Row, Table } from "@tanstack/react-table";
import {
  statusColors,
  type JobApplicationsColumn,
} from "./job-application-columns";
import { fetchRequestComponent } from "@/utils/fetch-request-component";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateMultipleJobApplicationProps {
  table: Table<JobApplicationsColumn>;
  row: Row<JobApplicationsColumn>;
}

export default function UpdateMultipleJobApplication({
  table,
  row,
}: UpdateMultipleJobApplicationProps) {
  const queryClient = useQueryClient();

  const statusArr: (typeof row.original.status)[] = [
    "employed",
    "rejected",
    "applied",
    "bookmarked",
    "waiting for result",
  ];

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
              <DropdownMenuRadioGroup
                value={row.original.status}
                onValueChange={async (value) => {
                  try {
                    let selectedRows: Row<JobApplicationsColumn>[] | string[] =
                      [];
                    if (table.getSelectedRowModel().rows.length === 0) {
                      selectedRows = [row.original.job_app_id];
                    } else {
                      selectedRows = table.getSelectedRowModel().rows;
                    }

                    const response = await fetchRequestComponent(
                      "/updateJobApplicationStatus",
                      "PATCH",
                      { selectedRows: selectedRows, status: value }
                    );

                    await queryClient.invalidateQueries({
                      queryKey: ["job-applications"],
                    });

                    return showToast("success", response.message);
                  } catch (error) {
                    if (error instanceof Error) {
                      console.log(error);
                      showToast("error", error.message);
                    }
                  }
                }}
              >
                {statusArr.map((status, index) => {
                  const textColor = statusColors[status].split(" ")[1];
                  const darkTextColor = statusColors[status].split(" ")[2];

                  return (
                    <DropdownMenuRadioItem
                      className={`${textColor} focus:${textColor} ${darkTextColor} capitalize`}
                      key={index}
                      value={status}
                    >
                      {status}
                    </DropdownMenuRadioItem>
                  );
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </>
    </DropdownMenuComponent>
  );
}
