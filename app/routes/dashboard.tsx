import type { Route } from "./+types/dashboard";

export function loader({ context }: Route.LoaderArgs) {}

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
