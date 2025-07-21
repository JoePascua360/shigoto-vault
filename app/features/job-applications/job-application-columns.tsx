import DynamicDialog from "@/components/dynamic-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { Tag } from "emblor";

type JobApplicationsColumn = {
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
    header: "Company",
    accessorKey: "company_name",
    cell: ({ row }) => (
      <div className="truncate font-medium ">
        {row.getValue("company_name")}
      </div>
    ),
  },
  {
    header: "Role",
    accessorKey: "role",
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
            <p className="whitespace-pre-line font-sub-text">{description}</p>
          </DynamicDialog>
        </div>
      );
    },
  },
  {
    header: "Min Salary",
    accessorKey: "min_salary",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("min_salary"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
  {
    header: "Max Salary",
    accessorKey: "max_salary",
    cell: ({ row }) => {
      const amount = parseInt(row.getValue("max_salary"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
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
              {tags.map((item, index) => (
                <div key={index}>
                  <Badge className="bg-secondary border border-primary text-primary w-full">
                    {item.text}
                  </Badge>
                </div>
              ))}
            </div>
          </DynamicDialog>
        </div>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
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
              {rounds.map((item, index) => (
                <div key={index}>
                  <Badge className="bg-secondary border border-primary text-primary w-full">
                    {item.text}
                  </Badge>
                </div>
              ))}
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
      const formatted = format(row.original.applied_at, "yyyy-MM-dd");
      return formatted;
    },
  },
];
