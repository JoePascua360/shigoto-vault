import Navbar from "@/components/navbar";
import type { Route } from "./+types/dashboard";

export function meta({ location }: Route.MetaArgs) {
  return [
    { title: location },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <>
      {/* <Navbar /> */}
      <p>hello</p>
    </>
  );
}
