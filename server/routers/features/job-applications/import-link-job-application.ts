import type { linkJobApplicationData } from "#/schema/features/job-applications/link-job-application-schema";
import express from "express";
import { ai } from "~/config/gemini-ai";

const importLinkJobApplication = express.Router();

importLinkJobApplication.post("/", async (req, res) => {
  try {
    const data: linkJobApplicationData = req.body;

    const jobListArray: string[] = [];

    for (const item of data.url) {
      jobListArray.push(item.jobList);
    }

    const prompt = `
      Can you paste the equivalent values for this set of objects according to these provided links? Make it an array. Make sure the details are correct.

      Fields:
      - company_name: string,
      - role: string,
      - job_description: string,
      - min_salary: number,
      - max_salary: number,
      - location: string,
      - job_type: ["Full-Time", "Contractual", "Part-Time", "Internship"], - pick one.
      - work_schedule: string,

      These are the links : \n${jobListArray.join("\n")}
      `;

    console.log(prompt);

    // TODO: fix error for this:
    // I am unable to access the content of the provided JobStreet links. It seems there are access restrictions such as paywalls or login requirements that prevent me from browsing the pages and extracting the information. Therefore, I cannot provide the requested job details.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `
        The provided links will be about job listings from websites like linkedIn, Indeed, etc.
        From these links, you will fill in the respective values for the objects provided in the prompt.
        It needs to match the values in the URL link... Please check the details carefully.
        `,
        tools: [{ urlContext: {} }, { googleSearch: {} }],
      },
    });

    console.log(response.text);
    // To get URLs retrieved for context
    console.log(
      response?.candidates?.map((item) => item.urlContextMetadata?.urlMetadata)
    );

    res.status(200).json({ message: "Updated successfully!" });
    return;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);

      res
        .status(500)
        .json({ message: `Internal Server Error! ${error.message}` });
      return;
    }
  }
});

export default importLinkJobApplication;
