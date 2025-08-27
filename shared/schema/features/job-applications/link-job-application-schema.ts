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

/**
 * @openapi
 * components:
 *  schemas:
 *    JobApplicationImportRequest:
 *      type: object
 *      required:
 *        - url
 *        - role
 *      properties:
 *        url:
 *          type: array
 *        items:
 *          type: object
 *          properties:
 *            jobList:
 *              type: string
 *              pattern: '/https:\/\/id\.jobstreet\.com\/id\/job\/[0-9]{8}(\?.*)?(\#.*)?$|https:\/\/(?:my|sg|ph)\.jobstreet\.com\/job\/[0-9]{8}(\?.*)?(\#.*)?$|https:\/\/linkedin\.com\/jobs\/view\/[0-9]{10}/'
 *          minItems: 1
 *          maxItems: 5
 *      example:
 *        url: [{ jobList: https://ph.jobstreet.com/job/86382955?cid=company-profile&ref=company-profile }, { jobList: https://sg.jobstreet.com/job/85303415?type=standard&ref=search-standalone&origin=cardTitle#sol=795b2bcba27aeb19ca7f3524b90c4a35c3c69f17 },{ jobList: https://my.jobstreet.com/job/84551579?type=standard&ref=search-standalone&origin=cardTitle#sol=67ab6a81d11d1aced44f374864a3d7d7e8501b08 } ]
 */
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
    .max(5, "Cannot exceed more than 5 links!"),
});

export type linkJobApplicationData = z.infer<typeof linkJobApplicationSchema>;
