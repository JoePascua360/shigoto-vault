import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { addJobApplicationFormArray } from "@/types/features/job-application/add-job-application-types";

export const addJobApplicationFormElements: Array<addJobApplicationFormArray> =
  [
    {
      element: (
        <>
          <FormField
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Dev" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ),
      title: {
        text: "Job Roles",
        className: "font-bold text-xl",
      },
      fieldNameArray: ["company_name", "role"],
    },
    {
      element: (
        <>
          <FormField
            name="job_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Looking for talented applicants..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ),
      title: {
        text: "Job Salary",
        className: "font-bold text-xl",
      },
      fieldNameArray: ["job_description"],
    },
    {
      element: (
        <>
          <FormField
            name="job_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <FormControl>
                  <Input placeholder="Dev" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ),
      title: {
        text: "Job Roles",
        className: "font-bold text-xl",
      },
      fieldNameArray: ["job_description"],
    },
  ];
