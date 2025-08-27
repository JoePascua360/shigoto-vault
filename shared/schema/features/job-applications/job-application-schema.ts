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
/**
 * @openapi
 * components:
 *  schemas:
 *    JobApplicationManualRequest:
 *      type: object
 *      required:
 *        - company_name
 *        - role
 *        - job_description
 *        - min_salary
 *        - max_salary
 *        - location
 *        - job_type
 *        - work_schedule
 *        - tag
 *        - status
 *        - rounds
 *        - applied_at
 *      properties:
 *        company_name:
 *          type: string
 *        role:
 *          type: string
 *        job_description:
 *          type: string
 *        min_salary:
 *          type: number
 *        max_salary:
 *          type: number
 *        location:
 *          type: string
 *        job_type:
 *          type: string
 *          enum: ["Full-Time", "Contractual", "Part-Time", "Internship"]
 *        work_schedule:
 *          type: string
 *        tag:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *              text:
 *                type: string
 *        status:
 *          type: string
 *          enum: ["employed", "rejected", "applied", "bookmarked", "ghosted", "waiting for result"]
 *        rounds:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *              text:
 *                type: string
 *        applied_at:
 *          type: string
 *          format: date-time
 *      example:
 *        company_name: Company A
 *        role: Engineer
 *        job_description: We seek talented individuals to work with...
 *        min_salary: 60000
 *        max_salary: 120000
 *        location: Metro Manila
 *        job_type: Full-Time
 *        work_schedule: 9am to 5pm Mon - Fri
 *        tag: [{id: "1", text: Ideal Job}, {id: "2", text: Good Pay}]
 *        status: applied
 *        rounds: [{id: "1", text: 1st Round}]
 *        applied_at: 2017-07-21T17:32:28Z
 */
export const backendJobApplicationSchema = baseJobApplicationSchema.extend({
  applied_at: z.iso.datetime().transform((val) => new Date(val)),
});

export type FrontendJobApplicationData = z.infer<
  typeof frontendJobApplicationSchema
>;
export type BackendJobApplicationData = z.infer<
  typeof backendJobApplicationSchema
>;
