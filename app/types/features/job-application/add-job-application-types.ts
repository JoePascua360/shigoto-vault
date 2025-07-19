import type { FrontendJobApplicationData } from "#/schema/features/job-applications/job-application-schema";

/*
   keyof FrontendJobApplicationData - avoids type error since this
   ensures that all elements in the array matches the object key
*/
export type addJobApplicationFormArray = {
  element: React.ReactElement;
  title: {
    text: string;
    className: string;
  };
  contentClassName: string;
  fieldNameArray: Array<keyof FrontendJobApplicationData>;
};
