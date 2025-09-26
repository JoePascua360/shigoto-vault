import type { JobApplicationStatus } from "#/types/types";
import type { JobApplicationsColumn } from "@/features/job-applications/job-application-columns";
import type { Row } from "@tanstack/react-table";
import type { Tag } from "emblor";

/**
 * Types used in each job application controller
 */
export namespace JobApplicationTypes {
  export type SelectedRows = string[];
  export type UpdateRowBase = {
    rows: SelectedRows;
    columnName: keyof JobApplicationsColumn;
  };

  export type UpdateStatusRequestBody = {
    status: JobApplicationStatus;
    rows: SelectedRows;
  };

  export type UpdateRowValueRequestBody = UpdateRowBase & {
    newValue: number;
    isSalaryColumn: boolean;
  };

  export type UpdateDialogRowRequestBody = UpdateRowBase & {
    newValue: Tag[] | string;
  };
}
