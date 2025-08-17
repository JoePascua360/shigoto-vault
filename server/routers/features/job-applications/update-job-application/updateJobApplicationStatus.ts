import { auth } from "#/lib/auth";
import type { JobApplicationsColumn } from "@/features/job-applications/job-application-columns";
import type { Row } from "@tanstack/react-table";
import { fromNodeHeaders } from "better-auth/node";
import express from "express";
import { StatusCodes } from "http-status-codes";
import * as db from "~/db/index";
import { queryInputArgumentSymbol } from "~/utils/query-input-argument-symbol";

const updateJobApplicationStatus = express.Router();

type RequestBody = {
  status:
    | "employed"
    | "rejected"
    | "applied"
    | "bookmarked"
    | "waiting for result";
  selectedRows: (string | Row<JobApplicationsColumn>)[];
};

updateJobApplicationStatus.patch("/", async (req, res) => {
  try {
    const data: RequestBody = req.body;

    const status = data?.status || "";
    const selectedRows = data?.selectedRows || [];

    if (selectedRows.length === 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Missing Job Application ID. Cannot Proceed.",
      });
      return;
    }

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    const values = [];
    for (const row of selectedRows) {
      const jobAppID = typeof row === "string" ? row : row.id;
      const userID = session?.session.userId || "";

      values.push(status, userID, jobAppID);
    }

    const queryCmd = `
      UPDATE job_applications as job_app
      SET status = job_app_val.status
      FROM
      (SELECT status, user_id, job_app_id::uuid
      FROM
      (VALUES ${queryInputArgumentSymbol(
        selectedRows.length,
        3,
        1
      )}) as t(status, user_id, job_app_id)
      ) as job_app_val(status, user_id, job_app_id)
      WHERE
      job_app_val.user_id = job_app.user_id
      AND
      job_app_val.job_app_id = job_app.job_app_id
      RETURNING *`;

    await db.query(queryCmd, [...values]);

    res
      .status(StatusCodes.OK)
      .json({ message: `Status updated successfully!` });
    return;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: `Internal Server Error! ${error.message}` });
      return;
    }
  }
});

export default updateJobApplicationStatus;
