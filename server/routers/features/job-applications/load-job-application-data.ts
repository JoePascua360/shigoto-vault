import express from "express";
import * as db from "~/db/index";

const loadJobApplicationData = express.Router();

loadJobApplicationData.get("/loadJobApplicationData", async (req, res) => {
  try {
    const query = "SELECT * FROM job_applications";

    const result = await db.query(query);

    res.status(200).json({ message: "Loaded successfully!", data: result });
    return;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      res
        .status(500)
        .json({ message: `Internal Server Error! ${error.message}` });
      return;
    }
  }
});

export default loadJobApplicationData;
