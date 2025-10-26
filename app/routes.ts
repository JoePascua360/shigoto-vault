import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./components/navbar.tsx", [
    index("routes/home.tsx"),
    route("signup", "./routes/signup.tsx"),
    route("*", "./components/missing-page.tsx", { id: "missing-page-navbar" }),
  ]),
  // all routes inside /app path
  layout("./layouts/sidebar-layout.tsx", [
    ...prefix("app", [
      route("dashboard", "./routes/dashboard.tsx"),
      route("settings", "./routes/settings.tsx", [
        index("routes/settings/profile.tsx"),
        route("account", "./routes/settings/account.tsx"),
      ]),
      route("job-applications", "./routes/job-applications.tsx"),
      route("*", "./components/missing-page.tsx", { id: "missing-page-app" }),
    ]),
  ]),
] satisfies RouteConfig;
