import { z } from "zod/v4";

export const linkJobApplicationSchema = z.object({
  url: z
    .array(
      z.object({
        jobList: z
          .url({ protocol: /^https$/, hostname: z.regexes.domain })
          .min(1, "Job Listing URL is required!"),
      })
    )
    .min(1, "Must have at least 1 URL to proceed!")
    .max(5, "Cannot exceed more than 10 links!"),
});

export type linkJobApplicationData = z.infer<typeof linkJobApplicationSchema>;
