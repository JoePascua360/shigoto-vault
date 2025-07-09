import Hero from "@/components/hero";
import type { Route } from "./+types/home";
import Navbar from "@/components/navbar";
import { ModeToggle } from "@/themes/mode-toggle";
import { authClient } from "@/config/auth-client";
import Spinner from "@/components/spinner";

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
