import type { JobApplicationStatus } from "#/types/types";
import type { JobApplicationsColumn } from "@/features/job-applications/job-application-columns";
import type { Row } from "@tanstack/react-table";

/**
 * Types used in each job application controller
 */
export namespace JobApplicationTypes {
  export type SelectedRows = string[];

  export type UpdateStatusRequestBody = {
    status: JobApplicationStatus;
    selectedRows: SelectedRows;
  };

  export type UpdateRowValueRequestBody = {
    newValue: number;
    rows: SelectedRows;
    columnName: string;
    isSalaryColumn: boolean;
  };
}
