import { auth } from "#/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import express from "express";
import { StatusCodes } from "http-status-codes";
import * as db from "~/db/index";

const loadJobApplicationData = express.Router();

loadJobApplicationData.get("/loadJobApplicationData", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    const createTable = `CREATE TABLE IF NOT EXISTS job_applications
    (
      job_app_id uuid, user_id text not null, company_name text NOT NULL,
      role text NOT NULL, job_description text, min_salary int, max_salary int,
      location text, job_type text NOT NULL, work_schedule text NOT NULL,
      created_at timestamp default current_timestamp, applied_at date,
      tag JSON, status text, rounds JSON,
      primary key(job_app_id),
      CONSTRAINT fk_user
        foreign key(user_id)
          references "user"(id)
      );`;

    const query = "SELECT * FROM job_applications WHERE user_id = $1";

    await db.query(createTable);

    const result = await db.query(query, [`${session?.user?.id}`]);

    const data = result.rows.length === 0 ? [] : result.rows;

    res.status(200).json({ message: "Loaded successfully!", rows: data });
    return;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `Internal Server Error! ${error.message}`,
      });
      return;
    }
  }
});

export default loadJobApplicationData;
