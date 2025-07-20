import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { FrontendJobApplicationData } from "#/schema/features/job-applications/job-application-schema";

import { Input } from "@/components/ui/input";

export default function JobApplicationStep2FormElement(
  form: UseFormReturn<FrontendJobApplicationData>
) {
  return (
    <>
      <section className="grid grid-cols-2 gap-2 mt-3">
        <FormField
          control={form.control}
          name="min_salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Min Salary</FormLabel>
              <FormControl>
                <div className="*:not-first:mt-2">
                  <div className="relative">
                    <Input
                      className="peer ps-6"
                      placeholder="0.00"
                      type="number"
                      {...field}
                    />
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                      €
                    </span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="max_salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Salary</FormLabel>
              <FormControl>
                <div className="*:not-first:mt-2">
                  <div className="relative">
                    <Input
                      className="peer ps-6"
                      placeholder="0.00"
                      type="number"
                      {...field}
                    />
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                      €
                    </span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>

      <section className="grid grid-cols-1 gap-2">
        <FormField
          control={form.control}
          name="job_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Type</FormLabel>
              <FormControl>
                <Input
                  placeholder="Full-time, Contractual, Part-time etc.."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="work_schedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Schedule</FormLabel>
              <FormControl>
                <Input placeholder="8am to 5pm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>
    </>
  );
}
