import { z } from "zod/v4";

export const jobApplicationEditableRowSchema = z.object({
  newValue: z.union([
    z.number().gte(1, "Salary cannot be lower than 1!"),
    z.string().min(1, "New value is required!"),
  ]),
  columnName: z.string().min(1, "Column name must be provided!"),
  rows: z
    .array(z.string().min(1, "Job application ID is required!"))
    .min(1, "Must select at least one row!"),
  isSalaryColumn: z.boolean(),
});

export type EditableRowData = z.infer<typeof jobApplicationEditableRowSchema>;
