import { z } from "zod/v4";

export const jobApplicationUpdateStatusSchema = z.object({
  status: z.enum([
    "employed",
    "rejected",
    "applied",
    "bookmarked",
    "waiting for result",
    "ghosted",
  ]),
  rows: z
    .array(z.string().min(1, "Job application ID is required!"))
    .min(1, "Must select at least one row!"),
});

export type UpdateStatus = z.infer<typeof jobApplicationUpdateStatusSchema>;
