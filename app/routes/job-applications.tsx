import type { Route } from "./+types/job-applications";
import {
  jobApplicationColumns,
  type Payment,
} from "@/features/job-applications/job-application-columns";
import { DataTable } from "@/components/data-table";

import { useDialog } from "@/hooks/use-dialog";

import AddJobApplication from "@/features/job-applications/add-job-application";

import Spinner from "@/components/spinner";
import { useQuery } from "@tanstack/react-query";

async function getJobApplications() {
  try {
    const response = await fetch("/api/v1/loadJobApplicationData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { data } = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data.rows;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }
}

export default function JobApplication({ loaderData }: Route.ComponentProps) {
  const query = useQuery({
    queryKey: ["job-applications"],
    queryFn: getJobApplications,
    staleTime: 60 * 1000, // will not refetch until 1 minute passed after initial fetch
  });

  const addDialog = useDialog();

  if (query.isLoading) return <Spinner isLoading={query.isLoading} />;

  return (
    <>
      <aside className="container mx-auto p-10">
        <main>
          <DataTable
            columns={jobApplicationColumns}
            data={query?.data}
            dropdownChildButton={
              <AddJobApplication dialogProps={addDialog.dialogProps} />
            }
          />
        </main>
      </aside>
    </>
  );
}
