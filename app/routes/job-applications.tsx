import type { Route } from "./+types/job-applications";
import { jobApplicationColumns } from "@/features/job-applications/job-application-columns";
import { DataTable } from "@/components/data-table";

import { useDialog } from "@/hooks/use-dialog";

import AddJobApplication from "@/features/job-applications/add-job-application";

import Spinner from "@/components/spinner";
import { useQuery } from "@tanstack/react-query";
import { isRouteErrorResponse } from "react-router";
import ErrorPage from "@/components/error-page";

async function getJobApplications() {
  try {
    const response = await fetch("/api/v1/loadJobApplicationData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(response);
      throw new Error(data?.message || "Something went wrong!");
    }

    return data.rows || [];
  } catch (error) {
    if (error instanceof Error) {
      const errorMsg = error.message;
      console.log(errorMsg);
      throw new Error(errorMsg);
    }
  }
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  } else if (error instanceof Error) {
    return <ErrorPage error={error} />;
  } else {
    return <h1>Unknown Error</h1>;
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
  if (query.isError) return <ErrorPage error={query.error} />;

  return (
    <>
      <aside className="container mx-auto p-10">
        <main>
          <DataTable
            columns={jobApplicationColumns}
            data={query?.data || []}
            dropdownChildButton={
              <AddJobApplication dialogProps={addDialog.dialogProps} />
            }
          />
        </main>
      </aside>
    </>
  );
}
