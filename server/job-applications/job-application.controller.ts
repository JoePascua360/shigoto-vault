import type { linkJobApplicationData } from "#/schema/features/job-applications/link-job-application-schema";
import type { JobApplicationStatus } from "#/types/types";
import type { JobApplicationsColumn } from "@/features/job-applications/job-application-columns";
import type { Row } from "@tanstack/react-table";
import { format } from "date-fns";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApplicationError } from "~/errors/ApplicationError";
import { jobApplicationService } from "~/job-applications/job-application.service";
import { jobStreetScrape } from "~/scraping/jobstreet-scrape";
import type { JobApplicationTypes } from "./types/job-application.types";
import type { Tag } from "emblor";

export const jobApplicationController = {
  /**
   * /loadData route | GET
   */
  get: async (req: Request, res: Response) => {
    const query = req.query;

    const queryParam = String(query.queryParam);
    const columnName = String(query.colName);
    const searchEnabled = query.searchEnabled === "true";

    const data = await jobApplicationService.loadJobApplicationData(
      queryParam,
      columnName,
      searchEnabled,
      req.context.session
    );

    res
      .status(StatusCodes.OK)
      .json({ message: "Loaded successfully!", rows: data });
    return;
  },
  /**
   * /addManually route | POST
   */
  add: async (req: Request, res: Response) => {
    const jobApplicationColumns = `
    job_app_id, user_id, company_name, role, job_description,
    min_salary, max_salary, location, job_type, work_schedule,
    tag, status, rounds,  applied_at
    `;

    let data = req.body;

    const applied_at = data.applied_at;
    // needs to convert it into JSON format to avoid JSON type error in postgres
    const tag = JSON.stringify(data.tag);
    const rounds = JSON.stringify(data.rounds);

    data.tag = tag;
    data.rounds = rounds;
    data.applied_at = format(new Date(applied_at), "yyyy-MM-dd");

    const { session } = req.context.session;

    const userID = session.userId;

    await jobApplicationService.addJobApplication(
      data,
      userID,
      jobApplicationColumns
    );

    res
      .status(StatusCodes.OK)
      .json({ message: "Job Application Added Successfully!" });
    return;
  },
  /**
   * /importLink route | POST
   */
  importLink: async (req: Request, res: Response) => {
    const data: linkJobApplicationData = req.body;

    const jobListArray: string[] = [];

    for (const item of data.url) {
      jobListArray.push(item.jobList);
    }

    const jobDetailObject = await jobStreetScrape(
      jobListArray,
      req.context.session
    );

    const jobDetailsArray = jobDetailObject?.jobDetailList || [];
    const skippedLinks = jobDetailObject?.skippedLinks || [];

    const skipLinksMessage =
      skippedLinks.length > 0
        ? `\n\nLinks skipped: ${skippedLinks.length}\n\n${skippedLinks
            .map(
              (item, index) =>
                `${index + 1}. ${item.link}\n   Reason: ${item.description}`
            )
            .join("\n\n")}`
        : "";

    // if theres no array received from scraping function, stop the router and return a response.
    if (jobDetailsArray.length <= 0) {
      throw new ApplicationError(
        `Provided link is taken down or has issues. ${skipLinksMessage}`,
        StatusCodes.NOT_FOUND
      );
    }

    await jobApplicationService.importLinkJobApplication(
      jobDetailsArray,
      req.context.session
    );

    res.status(StatusCodes.OK).json({
      message: `Job application/s saved successfully! ${skipLinksMessage}`,
      hasSkippedLinks: skippedLinks.length > 0,
    });
    return;
  },
  /**
   * /updateStatus route | PATCH
   */
  updateStatus: async (req: Request, res: Response) => {
    const data: JobApplicationTypes.UpdateStatusRequestBody = req.body;

    const status = data.status || "";
    const selectedRows = data.rows || [];

    if (selectedRows.length === 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Missing Job Application ID. Cannot Proceed.",
      });
      return;
    }

    const { session } = req.context.session;

    const values: (JobApplicationStatus | string)[] = [];
    for (const jobAppID of selectedRows) {
      const userID = session.userId || "";

      values.push(status, userID, jobAppID);
    }

    await jobApplicationService.updateJobApplicationStatus(
      selectedRows,
      values
    );

    res
      .status(StatusCodes.OK)
      .json({ message: `Job Application Status updated successfully!` });
    return;
  },
  /**
   * /updateRow route | PATCH
   */
  updateRowValue: async (req: Request, res: Response) => {
    const data: JobApplicationTypes.UpdateRowValueRequestBody = req.body;

    const { session } = req.context.session;

    const values: (string | number)[] = [];
    for (const jobAppID of data.rows) {
      const userID = session.userId || "";

      values.push(data.newValue, userID, jobAppID);
    }

    await jobApplicationService.updateJobApplicationRow(data, values);

    res
      .status(StatusCodes.OK)
      .json({ message: `Job Application Status updated successfully!` });
    return;
  },

  /**
   * /updateRow route | PATCH
   */
  updateDialogRowValue: async (req: Request, res: Response) => {
    const data: JobApplicationTypes.UpdateDialogRowRequestBody = req.body;
    const convertedNewValue =
      typeof data.newValue === "string"
        ? data.newValue
        : JSON.stringify(data.newValue as Tag[]);

    const { session } = req.context.session;

    const values: (Tag[] | string)[] = [];

    for (const jobAppID of data.rows) {
      const userID = session.userId || "";

      values.push(convertedNewValue, userID, jobAppID);
    }

    await jobApplicationService.updateJobApplicationDialogRow(data, values);

    res
      .status(StatusCodes.OK)
      .json({ message: `Job Application Status updated successfully!` });
    return;
  },

  /**
   * /delete route | DELETE
   */
  delete: async (req: Request, res: Response) => {
    const data: { rows: JobApplicationTypes.SelectedRows } = req.body;

    const { session } = req.context.session;

    const userID = session.userId;

    const result = await jobApplicationService.deleteJobApplication(
      data.rows,
      userID
    );

    res.status(StatusCodes.OK).json({
      message: `Job Application Status deleted successfully!`,
      data: result.rows,
    });
    return;
  },
};
