import { JobApplicationTable } from "@/components/table/job-applications/job-application-table";
import type { Route } from "./+types/job-applications";
import {
  jobApplicationColumns,
  type Payment,
} from "@/components/table/job-applications/job-application-columns";

export function loader({ params }: Route.LoaderArgs) {}

export default function JobApplication({ loaderData }: Route.ComponentProps) {
  const data: Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ];

  return (
    <>
      <div className="container mx-auto py-10">
        <JobApplicationTable columns={jobApplicationColumns} data={data} />
      </div>
    </>
  );
}
