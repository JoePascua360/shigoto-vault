import { z } from "zod/v4";

export const jobApplicationSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
});

export type jobApplicationData = z.infer<typeof jobApplicationSchema>;
