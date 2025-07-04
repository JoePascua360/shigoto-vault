import { type ColumnDef } from "@tanstack/react-table";

export type Payment = {
  // id: string;
  company_name: string;
  // name: string;
  // email: string;
  // location: string;
  // flag: string;
  // status: "Active" | "Inactive" | "Pending";
  // balance: number;
  // department: string;
  // role: string;
  // joinDate: string;
  // lastActive: string;
  // performance: "Good" | "Very Good" | "Excellent" | "Outstanding";
};

export const jobApplicationColumns: ColumnDef<Payment>[] = [
  {
    header: "Company Name",
    accessorKey: "company_name",
    cell: ({ row }) => (
      <div className="truncate font-medium">{row.getValue("company_name")}</div>
    ),
  },
  // {
  //   header: "Email",
  //   accessorKey: "email",
  // },
  // {
  //   header: "Location",
  //   accessorKey: "location",
  //   cell: ({ row }) => (
  //     <div className="truncate">
  //       <span className="text-lg leading-none">PH</span>{" "}
  //       {row.getValue("location")}
  //     </div>
  //   ),
  // },
  // {
  //   header: "Status",
  //   accessorKey: "status",
  // },
  // {
  //   header: "Balance",
  //   accessorKey: "balance",
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("balance"));
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount);
  //     return formatted;
  //   },
  // },
  // {
  //   header: "Department",
  //   accessorKey: "department",
  // },
  // {
  //   header: "Role",
  //   accessorKey: "role",
  // },
  // {
  //   header: "Join Date",
  //   accessorKey: "joinDate",
  // },
  // {
  //   header: "Last Active",
  //   accessorKey: "lastActive",
  // },
  // {
  //   header: "Performance",
  //   accessorKey: "performance",
  // },
];
