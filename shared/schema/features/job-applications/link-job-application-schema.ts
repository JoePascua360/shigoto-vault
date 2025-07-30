import { z } from "zod/v4";
/**
 * allowed hostname patterns: (allowed jobstreet subdomains - my | sg | ph | id)
 *
 * **Examples:**
 * - my.jobstreet.com/job/85943897
 * - jobstreet.vn/job/85943897?
 * - linkedin.com/jobs/view/8594389721
 * - ph.jobstreet.com/job/85943897?type=standard&ref=search-standalone&origin=jobCard#sol=68447aae473348604d56b3b9d2efae167c26c6a7
 */
const hostNameRegex =
  /https:\/\/id\.jobstreet\.com\/id\/job\/[0-9]{8}(\?.*)?(\#.*)?$|https:\/\/(?:my|sg|ph)\.jobstreet\.com\/job\/[0-9]{8}(\?.*)?(\#.*)?$|https:\/\/linkedin\.com\/jobs\/view\/[0-9]{10}/;

export const linkJobApplicationSchema = z.object({
  url: z
    .array(
      z.object({
        jobList: z
          .string()
          .regex(
            hostNameRegex,
            "Must be a valid JobStreet or LinkedIn job URL."
          ),
      })
    )
    .min(1, "Must have at least 1 URL to proceed!")
    .max(5, "Cannot exceed more than 10 links!"),
});

export type linkJobApplicationData = z.infer<typeof linkJobApplicationSchema>;
