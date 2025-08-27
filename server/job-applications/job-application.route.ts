import express from "express";
import { jobApplicationController } from "./job-application.controller";
import { asyncHandler } from "~/utils/asyncHandler";
import { schemaValidation } from "~/middlewares/schema-validation";
import { backendJobApplicationSchema } from "#/schema/features/job-applications/job-application-schema";
import { linkJobApplicationSchema } from "#/schema/features/job-applications/link-job-application-schema";
const jobApplicationRoute = express.Router();

/**
 * @openapi
 * /loadJobApplicationData:
 *   get:
 *     parameters:
 *       - in: query
 *         name: searchEnabled
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Needs to be true for the search function to work. Set to false or select nothing to return all results.
 *       - in: query
 *         name: colName
 *         schema:
 *           type: string
 *           enum: [company_name, role, job_description, location, job_type, work_schedule, status]
 *         description: Used to return only relevant results.
 *       - in: query
 *         name: queryParam
 *         schema:
 *           type: string
 *         description: Text to search within the column name selected in `colName` param.
 *     tags:
 *       - name: Job Applications Page
 *         description: List of all endpoints inside `/app/job-applications` page.
 *     summary: Get the job application data
 *     description: Loads job application data of the currently logged in user.
 *     responses:
 *       200:
 *         description: Successful Request. Status OK
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                rows:
 *                  type: array
 *                  items:
 *                    allOf:
 *                      - type: object
 *                        properties:
 *                          job_app_id:
 *                            type: string
 *                            format: uuid
 *                          user_id:
 *                            type: string
 *                          created_at:
 *                            type: string
 *                            format: date-time
 *                      - $ref: '#/components/schemas/AddJobApplications'
 *       401:
 *         description: Unauthorized Access. User needs to login or visit anything inside `/app` route to perform this action.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Error message details
 *       500:
 *         description: Internal Server Error. An unexpected error occurred on the server while processing the request.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Error message details
 */
jobApplicationRoute.get(
  "/loadJobApplicationData",
  asyncHandler(jobApplicationController.get)
);

/**
 * @openapi
 * /addJobApplication:
 *   post:
 *     tags:
 *       - name: Job Applications Page
 *         description: List of all endpoints inside `/app/job-applications` page.
 *     summary: Add Job Application data manually by providing the values directly
 *     description: Add job application data for the user
 *     requestBody:
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/JobApplicationManualRequest'
 *     responses:
 *       200:
 *         description: Successful Request. Status OK. View the newly added job-application [here](http://localhost:3000/app/job-applications).
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Successful message details
 *       400:
 *         description: Invalid data. Please check the value of the provided details carefully.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Error message details
 *       401:
 *         description: Unauthorized Access. User needs to login or visit anything inside `/app` route to perform this action.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Error message details
 *       500:
 *         description: Internal Server Error. An unexpected error occurred on the server while processing the request.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Error message details
 */
jobApplicationRoute.post(
  "/addJobApplication",
  schemaValidation(backendJobApplicationSchema),
  asyncHandler(jobApplicationController.add)
);
/**
 * @openapi
 * /importLinkJobApplication:
 *   post:
 *     tags:
 *       - name: Job Applications Page
 *         description: List of all endpoints inside `/app/job-applications` page.
 *     summary: Import job applications by providing URLs.
 *     description: Add job application data from Jobstreet/LinkedIn URLs. Maximum of 5 links per request.
 *     requestBody:
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/JobApplicationImportRequest'
 *     responses:
 *       200:
 *         description: Successful Request. Status OK. View the newly added job-application [here](http://localhost:3000/app/job-applications).
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Successful message details
 *       400:
 *         description: Invalid data. Please check the value of the provided details carefully.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Error message details
 *       401:
 *         description: Unauthorized Access. User needs to login or visit anything inside `/app` route to perform this action.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Error message details
 *       500:
 *         description: Internal Server Error. An unexpected error occurred on the server while processing the request.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Error message details
 */
jobApplicationRoute.post(
  "/importLinkJobApplication",
  schemaValidation(linkJobApplicationSchema),
  asyncHandler(jobApplicationController.importLink)
);

export default jobApplicationRoute;
