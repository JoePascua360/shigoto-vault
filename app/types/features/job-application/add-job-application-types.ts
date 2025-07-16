import type { jobApplicationData } from "#/schema/features/job-applications/job-application-schema";

/*
   keyof jobApplicationData - avoids type error since this
   ensures that all elements in the array matches the object key
*/
export type addJobApplicationFormArray = {
  element: React.ReactElement;
  title: {
    text: string;
    className: string;
  };
  fieldNameArray: Array<keyof jobApplicationData>;
};
