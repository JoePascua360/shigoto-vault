import { app } from "~/app";
import addJobApplication from "./add-job-application";
import { schemaValidation } from "~/middlewares/schema-validation";
import loadJobApplicationData from "./load-job-application-data";
import { jobApplicationSchema } from "#/schema/features/job-applications/job-application-schema";

export const jobApplicationRouters = (version: string) => {
  app.use(`/api/${version}/`, loadJobApplicationData);
  app.use(
    `/api/${version}/`,
    schemaValidation(jobApplicationSchema),
    addJobApplication
  );
};
