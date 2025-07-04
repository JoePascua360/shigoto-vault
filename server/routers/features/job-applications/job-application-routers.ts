import { app } from "~/app";
import addJobApplication from "./add-job-application";
import { schemaValidation } from "~/middlewares/schema-validation";
import { jobApplicationSchema } from "shared/schema/features/job-applications/job-application-schema";
import loadJobApplicationData from "./load-job-application-data";

export const jobApplicationRouters = (version: string) => {
  app.use(`/api/${version}/`, loadJobApplicationData);
  app.use(
    `/api/${version}/`,
    schemaValidation(jobApplicationSchema),
    addJobApplication
  );
};
