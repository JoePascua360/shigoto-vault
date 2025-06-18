import { NavLink } from "react-router";
import type { Route } from "./+types/404Page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "NotFoundPage" },
    { name: "Not Found", content: "Page Not Found!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_EXPRESS };
}

export default function NotFoundPage({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <p>404 ERROR</p>
    </>
  );
}
