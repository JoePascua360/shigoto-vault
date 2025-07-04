import { app } from "~/app";
import { jobApplicationRouters } from "./features/job-applications/job-application-routers";
import { GlobalConfigs } from "~/config/global-config";

export const setupRouters = () => {
  const apiVersion = GlobalConfigs.apiVersion;
  // call routers here
  // app.use(`/api/${apiVersion}`, jobApplicationRouters);
  jobApplicationRouters(apiVersion);
};
