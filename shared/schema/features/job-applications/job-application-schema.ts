import { z } from "zod/v4";

export const baseJobApplicationSchema = z.object({
  company_name: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  job_description: z.string().min(1, "Job Description is required"),
  min_salary: z
    .number()
    .gte(1, "Minimum Salary cannot be lower than 1!")
    .transform((val) => Number(val)),
  max_salary: z.number().gte(1, "Max salary cannot be lower than 1!"),
  location: z.string().min(1, "Location is required!"),
  job_type: z.enum(["Full-Time", "Contractual", "Part-Time", "Internship"]),
  work_schedule: z.string().min(1, "Work Schedule is required"),
  tag: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .min(1, "Tags must contain at least 1 item"),
  status: z.enum([
    "employed",
    "rejected",
    "applied",
    "bookmarked",
    "ghosted",
    "waiting for result",
  ]),
  rounds: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .min(1, "Rounds must contain at least 1 item"),
});

// Frontend schema - expects Date objects
export const frontendJobApplicationSchema = baseJobApplicationSchema.extend({
  applied_at: z.date(),
});

// Backend schema - transform into iso.datetime() format
export const backendJobApplicationSchema = baseJobApplicationSchema.extend({
  applied_at: z.iso.datetime().transform((val) => new Date(val)),
});

export type FrontendJobApplicationData = z.infer<
  typeof frontendJobApplicationSchema
>;
export type BackendJobApplicationData = z.infer<
  typeof backendJobApplicationSchema
>;
