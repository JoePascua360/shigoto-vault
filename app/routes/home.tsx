import type { Route } from "./+types/home";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";
import Navbar from "@/components/navbar";
import { ModeToggle } from "@/themes/mode-toggle";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_EXPRESS };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const message = loaderData.message;

  return <Navbar />;
}
