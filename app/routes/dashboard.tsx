import { isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/dashboard";
import ErrorPage from "@/components/error-page";

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

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <title>Dashboard | Shigoto Vault</title>
      <meta property="og:title" content="Shigoto Vault Dashboard" />
      <meta name="description" content="Job Application Summary" />

      {/* Main Content of the dashboard */}
      <main className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="bg-muted/50 aspect-square rounded-xl" />
          ))}
        </div>
      </main>
    </>
  );
}
