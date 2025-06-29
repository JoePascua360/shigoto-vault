import type { Route } from "./+types/job-applications";
import {
  jobApplicationColumns,
  type Payment,
} from "@/features/job-applications/job-application-columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

export function loader({ params }: Route.LoaderArgs) {}

export default function JobApplication({ loaderData }: Route.ComponentProps) {
  const data: Payment[] = [
    {
      id: "728ed52f",
      name: "Nice",
      location: "Dasma",
      email: "m@example.com",
      flag: "PH",
      balance: 900,
      department: "ADMIN",
      joinDate: "2024-05-20",
      lastActive: "today",
      performance: "Good",
      role: "Developer",
      status: "Active",
    },
    {
      id: "728ed52f2",
      name: "Niceasdasd",
      location: "Dasma",
      email: "masdasd@example.com",
      flag: "PH",
      balance: 900,
      department: "ADMIN",
      joinDate: "2024-05-20",
      lastActive: "today",
      performance: "Good",
      role: "Developer",
      status: "Active",
    },
    // ...
  ];

  return (
    <>
      <aside className="container mx-auto p-10">
        <main>
          <DataTable
            columns={jobApplicationColumns}
            data={data}
            dropdownChildButton={
              <Button>
                <Plus />
                Add Job Application
              </Button>
            }
          />
        </main>
      </aside>
    </>
  );
}
