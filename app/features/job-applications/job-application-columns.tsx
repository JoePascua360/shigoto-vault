import DropdownMenuComponent from "@/components/dropdown-component";
import DynamicDialog from "@/components/dynamic-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { Tag } from "emblor";
import { ArrowDownAZ, ArrowUpDown, ArrowUpZA, Edit2Icon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import JobApplicationActions from "./job-application-actions";
import EditTableRow from "@/components/form/edit-table-row";
import type { JobApplicationStatus } from "#/types/types";
import { useQueryClient } from "@tanstack/react-query";
import EditTableDialogRow from "@/components/form/edit-table-dialog-row";

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
  job_url: string;
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
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
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
    cell: ({ row, table }) => {
      return (
        <EditTableDialogRow
          key={`${row.id}-${row.original.job_description}`}
          currentRowValue={row.original.job_description}
          columnName="job_description"
          row={row}
          table={table}
          title="Details"
        />
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
    cell: ({ row, table }) => {
      return (
        <EditTableDialogRow
          currentRowValue={row.original.tag}
          columnName="tag"
          row={row}
          table={table}
          title="Tags"
        />
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
    cell: ({ row, table }) => {
      return (
        <EditTableDialogRow
          currentRowValue={row.original.rounds}
          columnName="rounds"
          row={row}
          table={table}
          title="Rounds"
        />
      );
    },
  },
  {
    header: "Job URL",
    accessorKey: "job_url",
    cell: ({ row, table }) => {
      return (
        <EditTableRow
          // component remounts when  value changes
          key={`${row.id}-${row.original.job_url}`}
          rowValue={row.original.job_url}
          columnName="job_url"
          table={table}
          row={row}
        />
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
