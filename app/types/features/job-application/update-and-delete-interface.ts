import type { JobApplicationsColumn } from "@/features/job-applications/job-application-columns";
import type { Row, Table } from "@tanstack/react-table";

export interface UpdateAndDeleteInterface {
  row: Row<JobApplicationsColumn>;
  table: Table<JobApplicationsColumn>;
}
