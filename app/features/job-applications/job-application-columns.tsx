import DropdownMenuComponent from "@/components/dropdown-component";
import DynamicDialog from "@/components/dynamic-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDialog } from "@/hooks/use-dialog";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { Tag } from "emblor";
import { Clipboard, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { showToast } from "@/utils/show-toast";

type JobApplicationsColumn = {
  job_app_id: string;
  company_name: string;
  role: string;
  job_description: string;
  min_salary: number;
  max_salary: number;
  location: string;
  job_type: "Full-Time" | "Contractual" | "Part-Time" | "Internship";
  work_schedule: string;
  tag: Tag[];
  status: string;
  rounds: Tag[];
  created_at: Date;
  applied_at: Date;
};

export const jobApplicationColumns: ColumnDef<JobApplicationsColumn>[] = [
  {
    header: ({ table }) => (
      <div className="flex gap-2 justify-between">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
        <p>Company</p>
      </div>
    ),
    accessorKey: "company_name",
    cell: ({ row }) => (
      <div className="truncate font-medium flex gap-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
        <p>{row.getValue("company_name")}</p>
      </div>
    ),
    minSize: 250,
  },
  {
    header: "Role",
    accessorKey: "role",
    minSize: 250,
  },
  {
    header: "Job Description",
    accessorKey: "job_description",
    cell: ({ row }) => {
      const description = row.original.job_description;

      const jobDescDialog = useDialog();

      return (
        <div className="flex justify-center">
          <DynamicDialog
            dialog={jobDescDialog}
            title="Job Description"
            triggerElement={<Button variant="outline">View Details</Button>}
          >
            <div className="overflow-y-auto h-88">
              <p className="whitespace-pre-line font-sub-text break-normal text-left">
                {description}
              </p>
            </div>
          </DynamicDialog>
        </div>
      );
    },
  },
  {
    header: "Min Salary",
    accessorKey: "min_salary",
    cell: ({ row }) => {
      if (!row.getValue("min_salary")) {
        return <p>Not specified.</p>;
      }

      const amount = parseFloat(row.getValue("min_salary"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(amount);
      return formatted;
    },
  },
  {
    header: "Max Salary",
    accessorKey: "max_salary",
    cell: ({ row }) => {
      if (!row.getValue("max_salary")) {
        return <p>Not specified.</p>;
      }

      const amount = parseInt(row.getValue("max_salary"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(amount);
      return formatted;
    },
  },
  {
    header: "Location",
    accessorKey: "location",
  },
  {
    header: "Job Type",
    accessorKey: "job_type",
  },
  {
    header: "Work Schedule",
    accessorKey: "work_schedule",
  },
  {
    header: "Tags",
    accessorKey: "tag",
    cell: ({ row }) => {
      const tags = row.original.tag;

      const tagDialog = useDialog();

      return (
        <div className="flex justify-center">
          <DynamicDialog
            dialog={tagDialog}
            title="Job Application Tags"
            triggerElement={<Button variant="outline">View Tags</Button>}
          >
            <div className="flex gap-2">
              {tags?.length > 0 ? (
                <>
                  {tags?.map((item, index) => (
                    <div key={index}>
                      <Badge className="bg-secondary border border-primary text-primary w-full">
                        {item.text}
                      </Badge>
                    </div>
                  ))}{" "}
                </>
              ) : (
                <p>No tags input.</p>
              )}
            </div>
          </DynamicDialog>
        </div>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      if (!row.original.status) {
        return <p>Not specified.</p>;
      }

      return <p>{row.original.status}</p>;
    },
  },
  {
    header: "Rounds",
    accessorKey: "rounds",
    cell: ({ row }) => {
      const rounds = row.original.rounds;

      const roundDialog = useDialog();

      return (
        <div className="flex justify-center">
          <DynamicDialog
            dialog={roundDialog}
            title="Job Application Tags"
            triggerElement={<Button variant="outline">View Rounds</Button>}
          >
            <div className="flex gap-2">
              {rounds?.length > 0 ? (
                <>
                  {rounds?.map((item, index) => (
                    <div key={index}>
                      <Badge className="bg-secondary border border-primary text-primary w-full">
                        {item.text}
                      </Badge>
                    </div>
                  ))}{" "}
                </>
              ) : (
                <p>No rounds input.</p>
              )}
            </div>
          </DynamicDialog>
        </div>
      );
    },
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const formatted = format(row.original.created_at, "yyyy-MM-dd hh:mm a");
      return formatted;
    },
  },
  {
    header: "Applied At",
    accessorKey: "applied_at",
    cell: ({ row }) => {
      if (!row.original.applied_at) {
        return <p>Not specified.</p>;
      }

      const formatted = format(row.original.applied_at, "yyyy-MM-dd");
      return formatted;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const jobID = row.original.job_app_id;

      return (
        <DropdownMenuComponent
          icon={<MoreHorizontal />}
          contentAlignment="start"
          triggerConfig={{ variant: "ghost", size: "icon" }}
          triggerTitle="Click to show options"
        >
          <>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(jobID);
                showToast("success", "Job ID copied successfully!");
              }}
            >
              <Clipboard />
              Copy Job ID
            </DropdownMenuItem>
          </>
        </DropdownMenuComponent>
      );
    },
    enableHiding: false,
    maxSize: 150,
  },
];
