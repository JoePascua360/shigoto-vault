import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("./layouts/sidebar-layout.tsx", [
    ...prefix("app", [
      route("dashboard", "./routes/dashboard.tsx"),
      route("job-applications", "./routes/job-applications.tsx"),
      route("*", "./components/missing-page.tsx", { id: "missing-page-app" }),
    ]),
  ]),
  route("*", "./components/missing-page.tsx", { id: "missing-page-root" }),
] satisfies RouteConfig;
