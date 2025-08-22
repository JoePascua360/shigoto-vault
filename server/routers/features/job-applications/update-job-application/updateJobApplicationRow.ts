import express from "express";
import { StatusCodes } from "http-status-codes";
import * as db from "~/db/index";
import { auth } from "#/lib/auth";
import { queryInputArgumentSymbol } from "~/utils/query-input-argument-symbol";
import { fromNodeHeaders } from "better-auth/node";
import type { Row } from "@tanstack/react-table";
import type { JobApplicationsColumn } from "@/features/job-applications/job-application-columns";

const updateJobApplicationRow = express.Router();

type RequestBody = {
  newValue: number;
  rows: (Row<JobApplicationsColumn> | string)[];
  columnName: string;
};

updateJobApplicationRow.patch("/", async (req, res) => {
  try {
    const data: RequestBody = req.body;

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    const values: (number | string)[] = [];
    for (const row of data.rows) {
      const jobAppID = typeof row === "string" ? row : row.id;
      const userID = session?.session.userId || "";

      values.push(data.newValue, userID, jobAppID);
    }

    const query = `
    UPDATE job_applications as job_app
    SET ${data.columnName} = job_app_val.${data.columnName}
    FROM
    (
    SELECT ${data.columnName}, user_id, job_app_id::uuid
    FROM (VALUES ${queryInputArgumentSymbol(data.rows.length, 3)})
    as t(${data.columnName}, user_id, job_app_id)
    )
    as job_app_val(${data.columnName}, user_id, job_app_id)
    WHERE
    job_app_val.user_id = job_app.user_id
    AND
    job_app_val.job_app_id = job_app.job_app_id
    RETURNING *
    `;

    await db.query(query, [...values]);

    res.status(StatusCodes.OK).json({ message: "Updated successfully!" });
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

export default updateJobApplicationRow;
