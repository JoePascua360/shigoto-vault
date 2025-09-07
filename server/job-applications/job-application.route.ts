import express from "express";
import { jobApplicationController } from "./job-application.controller";
import { asyncHandler } from "~/utils/asyncHandler";
import { schemaValidation } from "~/middlewares/schema-validation";
import { backendJobApplicationSchema } from "#/schema/features/job-applications/job-application-schema";
import { linkJobApplicationSchema } from "#/schema/features/job-applications/link-job-application-schema";
import { jobApplicationEditableRowSchema } from "#/schema/features/job-applications/job-application-editable-row-schema";
import { jobApplicationUpdateStatusSchema } from "#/schema/features/job-applications/job-application-update-status-schema";
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
 *       - Job Applications Page
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
 *                      - $ref: '#/components/schemas/JobApplicationManualRequest'
 *       401:
 *         description: Unauthorized Access. User needs to login or visit anything inside [`/app`](http://localhost:3000/app/dashboard) route to perform this action.
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
 *       - Job Applications Page
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
 *         description: Unauthorized Access. User needs to login or visit anything inside [`/app`](http://localhost:3000/app/dashboard) route to perform this action.
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
 *       - Job Applications Page
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
 *         description: Unauthorized Access. User needs to login or visit anything inside [`/app`](http://localhost:3000/app/dashboard) route to perform this action.
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

/**
 * @openapi
 * /updateJobApplicationStatus:
 *  patch:
 *     tags:
 *       - Job Applications Page
 *     summary: Update job application status
 *     description: Update the status of one or more job applications in a single request.
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/JobApplicationUpdateStatus'
 *          examples:
 *            singleRowExample:
 *              summary: Update one row
 *              value:
 *                status: "ghosted"
 *                rows: ['279be88e-b2a8-4083-9095-f241b8a5c79a']
 *            multipleRowExample:
 *              summary: Update multiple row
 *              value:
 *                status: "bookmarked"
 *                rows: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', '279be88e-b2a8-4083-9095-f241b8a5c79a']

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
 *         description: Unauthorized Access. User needs to login or visit anything inside [`/app`](http://localhost:3000/app/dashboard) route to perform this action.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Error message details
 *       404:
 *         description: Job Application ID does not exist. Make sure that the ID is correct.
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
 * components:
 *   schemas:
 *     JobApplicationStatus:
 *       type: string
 *       enum: ["employed", "rejected", "applied", "bookmarked", "ghosted", "waiting for result"]
 *     JobApplicationUpdateStatus:
 *       type: object
 *       properties:
 *         status:
 *           $ref: '#/components/schemas/JobApplicationStatus'
 *         rows:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 */
jobApplicationRoute.patch(
  "/updateJobApplicationStatus",
  schemaValidation(jobApplicationUpdateStatusSchema),
  asyncHandler(jobApplicationController.updateStatus)
);

/**
 * @openapi
 * /updateJobApplicationRow:
 *  patch:
 *     tags:
 *       - Job Applications Page
 *     summary: Update one or more job application row value.
 *     description: Update the row value of one or more job applications based on the provided column name.
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/JobApplicationUpdateRow'
 *          examples:
 *            singleRowExample:
 *              summary: Update one row value
 *              value:
 *                newValue: Manager
 *                isSalaryColumn: false
 *                columnName: role
 *                rows: ['279be88e-b2a8-4083-9095-f241b8a5c79a']
 *            multipleRowExample:
 *              summary: Update multiple row value
 *              value:
 *                newValue: 25000
 *                isSalaryColumn: true
 *                columnName: min_salary
 *                rows: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', '279be88e-b2a8-4083-9095-f241b8a5c79a']

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
 *         description: Unauthorized Access. User needs to login or visit anything inside [`/app`](http://localhost:3000/app/dashboard) route to perform this action.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Error message details
 *       404:
 *         description: Job Application ID does not exist. Make sure that the ID is correct.
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
 * components:
 *   schemas:
 *     JobApplicationUpdateRow:
 *       type: object
 *       properties:
 *        newValue:
 *          oneOf:
 *            - type: string
 *            - type: number
 *        columnName:
 *          type: string
 *        isSalaryColumn:
 *          type: boolean
 *        rows:
 *          type: array
 *          items:
 *            type: string
 *            format: uuid
 */
jobApplicationRoute.patch(
  "/updateJobApplicationRow",
  schemaValidation(jobApplicationEditableRowSchema),
  asyncHandler(jobApplicationController.updateRowValue)
);

export default jobApplicationRoute;
