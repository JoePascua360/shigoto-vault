import type { Session } from "@/config/auth-client";
import * as db from "~/db/index";

async function loadJobApplicationData(
  company_name: string,
  tableName: string,
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
    queryCmd = `SELECT * FROM job_applications WHERE user_id = $1 AND ${tableName} ILIKE $2 ORDER BY created_at desc`;
    values.push(session?.user?.id, `%${company_name}%`);
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

async function importLinkJobApplication() {
  console.log("ha");
}

async function addJobApplication() {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log("hjha");
    }, 2000);
    resolve();
  });
}

export const jobApplicationService = {
  importLinkJobApplication,
  addJobApplication,
  loadJobApplicationData,
};
