import type { Session } from "@/config/auth-client";
import * as db from "~/db/index";
import { v4 as uuidv4 } from "uuid";
import { jobStreetScrape } from "~/scraping/jobstreet-scrape";
import { ApplicationError } from "~/errors/ApplicationError";
import { StatusCodes } from "http-status-codes";
import { queryInputArgumentSymbol } from "~/utils/query-input-argument-symbol";
import { ai } from "~/config/gemini-ai";
import type { BackendJobApplicationData } from "#/schema/features/job-applications/job-application-schema";
import type { JobApplicationStatus } from "#/types/types";
import type { JobApplicationTypes } from "./types/job-application.types";

/**
 * Loads the job-applications table data.
 * Checks whether search is enabled to ensure that correct query command is executed.
 *
 * @param queryParam - user's query string when search is enabled
 * @param columnName- selected column when search is enabled.
 * @param searchEnabled - false when search input is blank, otherwise true.
 * @param session - user's session data
 */
async function loadJobApplicationData(
  queryParam: string,
  columnName: string,
  searchEnabled: boolean,
  session: Session | null
) {
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

  let queryCmd = "";

  const values = [];
  if (searchEnabled) {
    queryCmd = `SELECT * FROM job_applications WHERE user_id = $1 AND ${columnName} ILIKE $2 ORDER BY created_at desc`;
    values.push(session?.user?.id, `%${queryParam}%`);
  } else {
    queryCmd =
      "SELECT * FROM job_applications WHERE user_id = $1 ORDER BY created_at desc";
    values.push(session?.user?.id);
  }

  await db.query(createTable);
  const result = await db.query(queryCmd, values);
  const data = result.rows.length === 0 ? [] : result.rows;

  return data;
}

/**
 *
 * Imports job applications through Jobstreet/LinkedIn URLs.
 *
 * Maximum of 5 imports per request.
 *
 * @param jobDetailsArray - 2D array details from jobstreetScrape function
 * @param session - user's session data
 */
async function importLinkJobApplication(
  jobDetailsArray: string[][],
  session: Session
) {
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

  return await db.query(queryCmd, values.flat());
}

/**
 * Creates a new job application entry by manually providing data.
 *
 * @param data - formatted data from job-application controller
 * @param userID - user's ID from req.context.session
 * @param jobApplicationColumns - list of job-applications table column names.
 */
async function addJobApplication(
  data: BackendJobApplicationData,
  userID: string,
  jobApplicationColumns: string
) {
  // needs to convert it into JSON format to avoid JSON type error in postgres

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

  return await db.query(queryCmd, values);
}

/**
 *
 * @param selectedRows - list of job application IDs
 * @param values - array containing status, userID and job application ID
 * @example
 * const values: (JobApplicationStatus | string)[] = [
  'bookmarked',
  'ZWeJv0AfvShJb8qU0aOzsgWdeADsqCpB',
  '279be88e-b2a8-4083-9095-f241b8a5c79a',
]
 */
async function updateJobApplicationStatus(
  selectedRows: JobApplicationTypes.UpdateStatusRequestBody["rows"],
  values: (JobApplicationStatus | string)[]
) {
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

  const results = await db.query(queryCmd, [...values]);

  if (results.rowCount === 0) {
    throw new ApplicationError(
      "No matching job applications found.",
      StatusCodes.NOT_FOUND
    );
  }

  return results;
}

async function updateJobApplicationRow(
  data: JobApplicationTypes.UpdateRowValueRequestBody,
  values: (number | string)[]
) {
  const queryCmd = `
    UPDATE job_applications as job_app
    SET ${data.columnName} = job_app_val.${data.columnName}
    FROM
    (
    SELECT ${
      data.isSalaryColumn ? `${data.columnName}::integer` : data.columnName
    }, user_id, job_app_id::uuid
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

  const results = await db.query(queryCmd, [...values]);

  if (results.rowCount === 0) {
    throw new ApplicationError(
      "No matching job applications found.",
      StatusCodes.NOT_FOUND
    );
  }

  return results;
}

/**
 * Service layer for executing queries and other logic in job-applications page
 */
export const jobApplicationService = {
  importLinkJobApplication,
  addJobApplication,
  loadJobApplicationData,
  updateJobApplicationStatus,
  updateJobApplicationRow,
};
