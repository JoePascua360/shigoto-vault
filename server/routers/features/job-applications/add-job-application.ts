import express from "express";
import { StatusCodes } from "http-status-codes";
import * as db from "~/db/index";

const addJobApplication = express.Router();

addJobApplication.post("/addJobApplication", async (req, res) => {
  try {
    const data = req.body;

    const queryCmd = `INSERT INTO job_applications(company_name) VALUES ($1) RETURNING *`;

    const result = await db.query(queryCmd, [data.company_name]);

    console.log(result.rows[0]);

    res.status(StatusCodes.OK).json({ message: "Updated successfully!" });
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
