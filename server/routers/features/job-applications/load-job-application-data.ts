import express from "express";
import { StatusCodes } from "http-status-codes";
import * as db from "~/db/index";

const loadJobApplicationData = express.Router();

loadJobApplicationData.get("/loadJobApplicationData", async (req, res) => {
  try {
    const createTable = `CREATE TABLE IF NOT EXISTS job_applications
    (
      job_app_id text, user_id text, company_name text NOT NULL,
      role text NOT NULL, job_description text, salary int, qualifications text,
      skills text, location text, job_type text NOT NULL, work_schedule text NOT NULL,
      created_at timestamp default current_timestamp, applied_at date,
      tag text[], status text, rounds text[],
      primary key(job_app_id),
      CONSTRAINT fk_user
        foreign key(user_id)
          references "user"(id)
      );`;

    const query = "SELECT * FROM job_applications";

    await db.query(createTable);

    const result = await db.query(query);

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
