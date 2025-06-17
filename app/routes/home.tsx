import Hero from "@/components/hero";
import type { Route } from "./+types/home";
import Navbar from "@/components/navbar";
import { ModeToggle } from "@/themes/mode-toggle";

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_EXPRESS };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const message = loaderData.message;

  return (
    <>
      <title>Shigoto Vault</title>
      <meta property="og:title" content="Shigoto Vault" />
      <meta name="description" content="Welcome to Shigoto Vault!" />

      <nav className="flex flex-col gap-5 justify-between ">
        <Navbar />

        <main className="h-[90dvh]">
          <Hero />
        </main>
      </nav>
    </>
  );
}
