import DropdownMenuComponent from "@/components/dropdown-component";
import DynamicDialog from "@/components/dynamic-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { Tag } from "emblor";
import { ArrowDownAZ, ArrowUpDown, ArrowUpZA } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import JobApplicationActions from "./job-application-actions";
import EditTableRow from "@/components/form/edit-table-row";
import type { JobApplicationStatus } from "#/types/types";
import { useQueryClient } from "@tanstack/react-query";

export type JobApplicationsColumn = {
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
  status: JobApplicationStatus["status"];
  rounds: Tag[];
  created_at: Date;
  applied_at: Date;
};

export const statusColors = {
  employed: "bg-green-100 text-green-800 dark:text-green-600",
  rejected: "bg-red-100 text-red-800 dark:text-red-500",
  applied: "bg-blue-100 text-blue-800 dark:text-blue-500",
  bookmarked: "bg-amber-100 text-amber-800 dark:text-amber-600",
  ghosted: "bg-gray-300 text-gray-800 dark:text-gray-600",
  "waiting for result": "bg-purple-100 text-purple-800 dark:text-purple-500",
};

export const jobApplicationColumns: ColumnDef<JobApplicationsColumn>[] = [
  {
    header: ({ table, column }) => {
      return (
        <header className="flex items-center gap-2 w-full">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="size-4.5"
          />
          <p>Company</p>
          <Button
            variant="link"
            size="icon"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            title="Sort Alphabetically"
            aria-label="Sort Alphabetically"
            className="cursor-pointer"
          >
            {!column.getIsSorted() && <ArrowUpDown />}
            {column.getIsSorted() === "asc" && <ArrowDownAZ />}
            {column.getIsSorted() === "desc" && <ArrowUpZA />}
          </Button>
        </header>
      );
    },
    accessorKey: "company_name",
    cell: ({ row, table }) => {
      return (
        <div className=" font-medium flex gap-2 items-center p-0.5">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="size-4.5"
          />
          <div className="min-w-0 flex-1">
            <EditTableRow
              // component remounts when  value changes
              key={`${row.id}-${row.original.company_name}`}
              rowValue={row.original.company_name}
              columnName="company_name"
              table={table}
              row={row}
            />
          </div>
        </div>
      );
    },
    minSize: 250,
  },
  {
    header: ({ column }) => (
      <header className="flex items-center gap-2 w-full">
        <p>Role</p>
        <Button
          variant="link"
          size="icon"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          title="Sort Alphabetically"
          aria-label="Sort Alphabetically"
          className="cursor-pointer"
        >
          {!column.getIsSorted() && <ArrowUpDown />}
          {column.getIsSorted() === "asc" && <ArrowDownAZ />}
          {column.getIsSorted() === "desc" && <ArrowUpZA />}
        </Button>
      </header>
    ),
    accessorKey: "role",
    minSize: 250,
    cell: ({ row, table }) => {
      const role = row.original.role;

      return (
        <EditTableRow
          // component remounts when value changes
          key={`${row.id}-${role}`}
          rowValue={role}
          columnName="role"
          table={table}
          row={row}
        />
      );
    },
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
    cell: ({ row, table }) => {
      const amount = parseFloat(row.getValue("min_salary"));
      const isNan = Number.isNaN(amount);

      return (
        <EditTableRow
          // component remounts when value changes
          key={`${row.id}-${amount}`}
          rowValue={isNan ? undefined : amount}
          columnName="min_salary"
          table={table}
          row={row}
        />
      );
    },
  },
  {
    header: "Max Salary",
    accessorKey: "max_salary",
    cell: ({ row, table }) => {
      const amount = parseFloat(row.getValue("max_salary"));
      const isNan = Number.isNaN(amount);

      return (
        <EditTableRow
          // component remounts when role value changes
          key={`${row.id}-${amount}`}
          rowValue={isNan ? undefined : amount}
          columnName="max_salary"
          table={table}
          row={row}
        />
      );
    },
  },
  {
    header: ({ column }) => (
      <header className="flex items-center gap-2 w-full">
        <p>Location</p>
        <Button
          variant="link"
          size="icon"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          title="Sort Alphabetically"
          aria-label="Sort Alphabetically"
          className="cursor-pointer"
        >
          {!column.getIsSorted() && <ArrowUpDown />}
          {column.getIsSorted() === "asc" && <ArrowDownAZ />}
          {column.getIsSorted() === "desc" && <ArrowUpZA />}
        </Button>
      </header>
    ),
    accessorKey: "location",
    cell: ({ row, table }) => {
      return (
        <EditTableRow
          // component remounts when  value changes
          key={`${row.id}-${row.original.location}`}
          rowValue={row.original.location}
          columnName="location"
          table={table}
          row={row}
        />
      );
    },
  },
  {
    header: "Job Type",
    accessorKey: "job_type",
    cell: ({ row, table }) => {
      return (
        <EditTableRow
          // component remounts when  value changes
          key={`${row.id}-${row.original.job_type}`}
          rowValue={row.original.job_type}
          columnName="job_type"
          table={table}
          row={row}
        />
      );
    },
  },
  {
    header: ({ column }) => (
      <header className="flex items-center gap-2 w-full">
        <p>Work Schedule</p>
        <Button
          variant="link"
          size="icon"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          title="Sort Alphabetically"
          aria-label="Sort Alphabetically"
          className="cursor-pointer"
        >
          {!column.getIsSorted() && <ArrowUpDown />}
          {column.getIsSorted() === "asc" && <ArrowDownAZ />}
          {column.getIsSorted() === "desc" && <ArrowUpZA />}
        </Button>
      </header>
    ),
    accessorKey: "work_schedule",
    cell: ({ row, table }) => {
      return (
        <EditTableRow
          // component remounts when  value changes
          key={`${row.id}-${row.original.work_schedule}`}
          rowValue={row.original.work_schedule}
          columnName="work_schedule"
          table={table}
          row={row}
        />
      );
    },
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

      return (
        <Badge
          variant="outline"
          className={`${
            statusColors[row.original.status]
          } rounded-full capitalize border-2 border-vault-purple`}
        >
          {row.original.status}
        </Badge>
      );
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
    cell: ({ table, row }) => {
      const queryClient = useQueryClient();

      return (
        <JobApplicationActions
          table={table}
          row={row}
          queryClient={queryClient}
        />
      );
    },
    enableHiding: false,
    maxSize: 150,
  },
];
