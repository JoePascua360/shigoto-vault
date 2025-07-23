import express from "express";
import { StatusCodes } from "http-status-codes";
import * as db from "~/db/index";
import { v4 as uuidv4 } from "uuid";
import { auth } from "#/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { format } from "date-fns";

const addJobApplication = express.Router();

const jobApplicationColumns = `
    job_app_id, user_id, company_name, role, job_description,
    min_salary, max_salary, location, job_type, work_schedule,
    tag, status, rounds,  applied_at
  `;

addJobApplication.post("/", async (req, res) => {
  try {
    let data = req.body;

    const applied_at = data.applied_at;

    // needs to convert it into JSON format to avoid JSON type error in postgres
    const tag = JSON.stringify(data.tag);
    const rounds = JSON.stringify(data.rounds);

    data.tag = tag;
    data.rounds = rounds;
    data.applied_at = format(new Date(applied_at), "yyyy-MM-dd");

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    const userID = session?.session.userId || null;

    const valueString: string[] = Object.values(data).map((_, index) => {
      let prefix = "";

      // index starts at 3 since 2 of them at the start needs a custom value
      if (index + 1 !== Object.values(data).length) {
        prefix = `$${index + 3}, `;
      } else {
        prefix = `$${index + 3}`;
      }

      return prefix;
    });

    const queryCmd = `INSERT INTO job_applications (${jobApplicationColumns}) VALUES ($1, $2, ${valueString.join(
      ""
    )}) RETURNING *`;

    const values = [uuidv4(), userID, ...Object.values(data)];

    await db.query(queryCmd, values);

    res.status(StatusCodes.OK).json({ message: "Inserted successfully!" });
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `Error! ${error.message}`,
      });
      return;
    }
  }
});

export default addJobApplication;
