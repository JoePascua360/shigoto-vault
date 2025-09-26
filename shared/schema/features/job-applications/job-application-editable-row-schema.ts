import { z } from "zod/v4";

export const jobApplicationBaseEditSchema = z.object({
  columnName: z.string().min(1, "Column name must be provided!"),
  rows: z
    .array(z.string().min(1, "Job application ID is required!"))
    .min(1, "Must select at least one row!"),
});

export const jobApplicationEditableRowSchema =
  jobApplicationBaseEditSchema.extend({
    newValue: z.union([
      z.number().gte(1, "Salary cannot be lower than 1!"),
      z.string().min(1, "New value is required!"),
    ]),
    isSalaryColumn: z.boolean(),
  });

export type EditableRowData = z.infer<typeof jobApplicationEditableRowSchema>;
