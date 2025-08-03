import { auth } from "#/lib/auth";
import type { linkJobApplicationData } from "#/schema/features/job-applications/link-job-application-schema";
import { fromNodeHeaders } from "better-auth/node";
import express from "express";
import { ai } from "~/config/gemini-ai";
import { jobStreetScrape } from "~/scraping/jobstreet-scrape";
import { queryInputArgumentSymbol } from "~/utils/query-input-argument-symbol";
import { v4 as uuidv4 } from "uuid";
import * as db from "~/db/index";

const importLinkJobApplication = express.Router();

importLinkJobApplication.post("/", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    const data: linkJobApplicationData = req.body;

    const jobListArray: string[] = [];

    for (const item of data.url) {
      jobListArray.push(item.jobList);
    }

    const jobDetailObject = await jobStreetScrape(jobListArray, session);

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
      const message = `Provided link is taken down or has issues. ${skipLinksMessage}`;

      res.status(404).json({
        message: message,
      });
      return;
    }

    const prompt = `
      Can you replace the value of these objects according to the list of arrays given? Make it a JSON format according to the schema below:

      Fields:
      - company_name: string,
      - role: string,
      - job_description: string, - for this field, if it looks like something is a list, don't hesitate to make it a list by adding - symbol at the start of each list. Do not remove anything, it should match the whole job description.
      - min_salary: number, - for min salary field, if the salary description is per hour, make it (salary * 8) * 30 to get the monthly pay.
      - max_salary: number, - for max salary field, if the salary description is per hour, make it (salary * 8) * 30 to get the monthly pay.
      - location: string,
      - job_type: "Full-Time" | "Contractual" | "Part-Time" |"Internship", - Pick one. Make sure it matches the string inside this list.
      - work_schedule: string, - refers to whether it's 8am to 5pm Mon - Fri etc.
                                 You can find information about this in the last element of the array. The very long one, which is the job_description key.
                                 If you can't find it, then just make it 'Not Specified'.

      These are the list of array: \n${jobDetailsArray}
      `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: `
        The provided array is a list of scraped data from any of the following: Jobstreet, LinkedIn, or Indeed
        Only respond with the JSON schema output, no need for explanations. That's the only response you should give.
        Always make it an Array with JSON schema inside, even if there is only 1 item.
        `,
      },
    });

    const aiResponse = response.text || "";

    // remove ```json ``` from the response of AI
    const cleaned = aiResponse.replace(/```(?:json)?\s*|\s*```$/g, "").trim();

    const jsonFormat = JSON.parse(cleaned || "");
    const queryCmd = `insert into job_applications
    (
      job_app_id, user_id, company_name, role, job_description,
      min_salary, max_salary, location, job_type, work_schedule
    )
    values ${queryInputArgumentSymbol(jsonFormat.length, 10, 1)} RETURNING *`;

    const values = [];

    for (const item of jsonFormat) {
      const value = Object.values(item);

      const val = [uuidv4(), session?.session.userId, ...value];

      values.push(val);
    }

    await db.query(queryCmd, values.flat());

    res.status(200).json({
      message: `Job application/s saved successfully! ${skipLinksMessage}`,
      hasSkippedLinks: skippedLinks.length > 0,
    });
    return;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);

      res.status(500).json({
        message: `Internal Server Error! ${error.message}`,
      });
      return;
    }
  }
});

export default importLinkJobApplication;
