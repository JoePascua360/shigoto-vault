import { app } from "~/app";
import addJobApplication from "./add-job-application";
import { schemaValidation } from "~/middlewares/schema-validation";
import loadJobApplicationData from "./load-job-application-data";
import { backendJobApplicationSchema } from "#/schema/features/job-applications/job-application-schema";
import { linkJobApplicationSchema } from "#/schema/features/job-applications/link-job-application-schema";
import importLinkJobApplication from "./import-link-job-application";

export const jobApplicationRouters = (version: string) => {
  app.use(`/api/${version}/loadJobApplicationData`, loadJobApplicationData);

  // add/import job application routers
  app.use(
    `/api/${version}/addJobApplication`,
    schemaValidation(backendJobApplicationSchema),
    addJobApplication
  );
  app.use(
    `/api/${version}/importLinkJobApplication`,
    schemaValidation(linkJobApplicationSchema),
    importLinkJobApplication
  );
};
