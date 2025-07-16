import Hero from "@/components/hero";
import type { Route } from "./+types/home";
import Navbar from "@/components/navbar";
import { ModeToggle } from "@/themes/mode-toggle";
import { authClient } from "@/config/auth-client";
import Spinner from "@/components/spinner";
import { isRouteErrorResponse } from "react-router";
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

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <title>Shigoto Vault</title>
      <meta property="og:title" content="Shigoto Vault" />
      <meta name="description" content="Welcome to Shigoto Vault!" />

      <Hero />
    </>
  );
}
