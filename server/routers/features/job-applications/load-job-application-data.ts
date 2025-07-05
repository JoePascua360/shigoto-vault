import express from "express";
import { StatusCodes } from "http-status-codes";
import * as db from "~/db/index";

const loadJobApplicationData = express.Router();

loadJobApplicationData.get("/loadJobApplicationData", async (req, res) => {
  try {
    const createTable = `CREATE TABLE IF NOT EXISTS job_applications
    (
      id int GENERATED ALWAYS AS IDENTITY primary key, company_name text,
      role text, job_description text, salary int, qualifications text,
      skills text, location text, job_type text, work_schedule text,
      created_at timestamp default current_timestamp, applied_at date,
      tag text[], status text, rounds text[]
      )`;

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
