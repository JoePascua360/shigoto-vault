import { type ColumnDef } from "@tanstack/react-table";

type JobApplicationsColumn = {
  company_name: string;
  role: string;
  job_description: string;
  salary: number;
  qualifications: string;
  skills: string;
  job_type: string;
  work_schedule: string;
  tag: string[];
  status: string;
  rounds: string[];
  created_at: Date;
  applied_at: Date;
};

export const jobApplicationColumns: ColumnDef<JobApplicationsColumn>[] = [
  {
    header: "Company",
    accessorKey: "company_name",
    cell: ({ row }) => (
      <div className="truncate font-medium">{row.getValue("company_name")}</div>
    ),
  },
  {
    header: "Role",
    accessorKey: "role",
  },
  {
    header: "Job Description",
    accessorKey: "job_description",
  },
  {
    header: "Salary",
    accessorKey: "salary",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("salary"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
  {
    header: "Qualifications",
    accessorKey: "qualifications",
  },
  {
    header: "Skills",
    accessorKey: "skills",
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
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Rounds",
    accessorKey: "rounds",
  },
  {
    header: "Created At",
    accessorKey: "created_at",
  },
  {
    header: "Applied At",
    accessorKey: "applied_at",
  },
];
