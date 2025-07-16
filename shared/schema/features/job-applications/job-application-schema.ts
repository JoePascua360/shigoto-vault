import { z } from "zod/v4";

export const jobApplicationSchema = z.object({
  company_name: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  job_description: z.string().min(1, "Job Description is required"),
  min_salary: z.number().min(1, "Minimum Salary cannot be lower than 1!"),
  max_salary: z.number().min(1, "Maximum Salary cannot be lower than 1!"),
  location: z.string().min(1, "Location is required!"),
  job_type: z.string().min(1, "Job Type is required"),
  work_schedule: z.string().min(1, "Work Schedule is required"),
  tag: z.array(z.string()),
  status: z.literal([
    "employed",
    "rejected",
    "applied",
    "bookmarked",
    "waiting for result",
  ]),
  rounds: z.array(z.string()),
  applied_at: z.date(),
});

export type jobApplicationData = z.infer<typeof jobApplicationSchema>;
