import type { addJobApplicationFormArray } from "@/types/features/job-application/add-job-application-types";
import { type UseFormReturn } from "react-hook-form";
import type { FrontendJobApplicationData } from "#/schema/features/job-applications/job-application-schema";
import JobApplicationStep3FormElement from "@/components/form/features/job-applications/job-application-step-3-form-element";
import JobApplicationStep2FormElement from "@/components/form/features/job-applications/job-application-step-2-form-element";
import JobApplicationStep1FormElement from "@/components/form/features/job-applications/job-application-step-1-form-element";

export function addJobApplicationFormElementsHook(
  form: UseFormReturn<FrontendJobApplicationData>
) {
  const formArray: Array<addJobApplicationFormArray> = [
    // STEP 1 FORM ELEMENTS
    {
      element: <>{JobApplicationStep1FormElement(form)}</>,
      title: {
        text: "Job Information",
        className: "font-bold text-xl",
      },
      contentClassName: "space-y-2",
      fieldNameArray: ["company_name", "role", "job_description", "location"],
    },
    // STEP 2 FORM ELEMENTS
    {
      element: <>{JobApplicationStep2FormElement(form)}</>,
      title: {
        text: "Job Compensation",
        className: "font-bold text-xl",
      },
      contentClassName: "space-y-4",
      fieldNameArray: ["min_salary", "max_salary", "job_type", "work_schedule"],
    },
    // STEP 3 FORM ELEMENTS
    {
      element: <>{JobApplicationStep3FormElement(form)}</>,
      title: {
        text: "Extra Information",
        className: "font-bold text-xl",
      },
      contentClassName: "space-y-4",
      fieldNameArray: ["tag", "status", "rounds", "applied_at"],
    },
  ];

  return formArray;
}
