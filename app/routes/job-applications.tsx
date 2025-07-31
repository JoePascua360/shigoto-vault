import type { Route } from "./+types/job-applications";
import { jobApplicationColumns } from "@/features/job-applications/job-application-columns";
import { DataTable } from "@/components/data-table";

import { useDialog } from "@/hooks/use-dialog";

import AddJobApplication from "@/features/job-applications/add-job-applications/add-job-application";

import Spinner from "@/components/spinner";
import { useQuery } from "@tanstack/react-query";
import { isRouteErrorResponse, useSearchParams } from "react-router";
import ErrorPage from "@/components/error-page";
import { fetchRequestComponent } from "@/utils/fetch-request-component";
import ImportJobApplication from "@/features/job-applications/import-job-applications/import-job-application";
import { useEffect } from "react";

async function getJobApplications(searchParams: string, columnName: string) {
  try {
    const formattedParams = encodeURIComponent(searchParams);
    const searchEnabled = searchParams !== "" ? true : false;

    console.log(searchEnabled);

    const response = await fetchRequestComponent(
      `/loadJobApplicationData?searchEnabled=${searchEnabled}&colName=${columnName}&company_name=${formattedParams}`,
      "GET"
    );

    return response.rows || [];
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
  const [searchParams, setSearchParams] = useSearchParams();

  const params = searchParams.get("jobApplication") || "";

  const columnName = localStorage.getItem("jobApplications") || "role";

  useEffect(() => {
    if (!localStorage.getItem("jobApplications")) {
      localStorage.setItem("jobApplications", "role");
    }
  }, []);

  const query = useQuery({
    queryKey: ["job-applications", params],
    queryFn: () => getJobApplications(params, columnName),
    staleTime: 60 * 1000, // will not refetch until 1 minute passed after initial fetch
  });

  const initialHiddenColumns = {
    min_salary: false,
    max_salary: false,
    tag: false,
    rounds: false,
    created_at: false,
    applied_at: false,
  };

  const addDialog = useDialog();

  if (query.isError) return <ErrorPage error={query.error} />;

  return (
    <>
      <aside className="container mx-auto p-10">
        <main>
          <DataTable
            initialHiddenColumns={initialHiddenColumns}
            columns={jobApplicationColumns}
            data={query?.data || []}
            dropdownChildButton={
              <>
                <ImportJobApplication />
                <AddJobApplication dialog={addDialog} />
              </>
            }
            isLoading={query.isLoading}
          />
        </main>
      </aside>
    </>
  );
}
