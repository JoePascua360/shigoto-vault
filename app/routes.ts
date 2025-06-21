import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("./layouts/sidebar-layout.tsx", [
    route("dashboard", "./routes/dashboard.tsx"),
    route("job-applications", "./routes/job-applications.tsx"),
    route("*", "./routes/404Page.tsx"),
  ]),
] satisfies RouteConfig;
