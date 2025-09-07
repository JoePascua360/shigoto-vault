import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit2Icon, SaveIcon, XIcon } from "lucide-react";
import { FaSpinner } from "react-icons/fa6";
import TooltipWrapper from "../tooltip-wrapper";
import type { JobApplicationsColumn } from "@/features/job-applications/job-application-columns";
import type { Row, Table } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  jobApplicationEditableRowSchema,
  type EditableRowData,
} from "#/schema/features/job-applications/job-application-editable-row-schema";
import { fetchRequestComponent } from "@/utils/fetch-request-component";
import { showToast } from "@/utils/show-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditTableRowProps {
  /**
   * @param rowValue - the value from `row.getValue` or `row.original`
   */
  rowValue: number | string | undefined;
  /**
   * @param columnName - column to be updated in the server
   */
  columnName: keyof JobApplicationsColumn;
  /**
   * @param table - used to get the selected rows in the table
   */
  table: Table<JobApplicationsColumn>;
  /**
   * @param row - used to get the row id
   */
  row: Row<JobApplicationsColumn>;
}
/**
 * Component for editing the table rows
 */
export default function EditTableRow({
  rowValue,
  columnName,
  table,
  row,
}: EditTableRowProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const isSalaryColumn =
    ["min_salary", "max_salary"].includes(columnName) && rowValue !== undefined;

  const salaryValue = isSalaryColumn
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(typeof rowValue === "string" ? parseInt(rowValue) : rowValue)
    : "";

  const defaultRowValue = rowValue === undefined ? "Not Specified" : rowValue;

  const {
    handleSubmit,
    setValue,
    register,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobApplicationEditableRowSchema),
    defaultValues: {
      newValue: defaultRowValue,
      rows: [row.id],
      isSalaryColumn,
      columnName,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: EditableRowData) => {
      try {
        const rows: string[] =
          table.getSelectedRowModel().rows.length === 0
            ? [row.id]
            : table.getSelectedRowModel().rows.map((row) => row.id);

        const formData = {
          ...data,
          rows,
        };

        await fetchRequestComponent("/updateJobApplicationRow", "PATCH", {
          ...formData,
        });

        setIsEditing(false);

        return { ...formData };
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          throw new Error(error.message);
        }
        throw new Error("Unknown error occurred");
      }
    },
    async onSuccess(data) {
      const length = data.rows.length;

      showToast(
        "success",
        `${length} ${length > 1 ? "rows" : "row"} updated successfully!`
      );
      await queryClient.invalidateQueries({ queryKey: ["job-applications"] });
    },
    onError: (error: Error) => {
      return showToast("error", error.message);
    },
  });

  useEffect(() => {
    if (isEditing) {
      setFocus("newValue");
    }
  }, [isEditing]);

  useEffect(() => {
    if (errors.newValue?.message) {
      showToast("error", errors.newValue.message || "", 1500);
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <div className="flex items-center group gap-2">
        {isEditing ? (
          <>
            <Input
              {...register("newValue", {
                valueAsNumber: isSalaryColumn,
                onChange(e) {
                  setValue("newValue", e.target.value);
                  const val = e.target.value;

                  if (val !== "Not Specified" && val !== rowValue) {
                    setIsEditing(true);
                  } else {
                    setIsEditing(false);
                  }
                },
              })}
              type={isSalaryColumn ? "number" : "text"}
              className="border-none shadow-none dark:bg-transparent"
            />

            <div className="flex gap-2">
              {mutation.isPending ? (
                <FaSpinner size={20} className="animate-spin" />
              ) : (
                <>
                  <button type="submit">
                    <SaveIcon
                      size={20}
                      className="cursor-pointer"
                      aria-label="Save Changes"
                    />
                  </button>

                  <XIcon
                    size={20}
                    className="cursor-pointer"
                    aria-label="Cancel"
                    onClick={() => {
                      setValue("newValue", defaultRowValue);
                      setIsEditing(false);
                    }}
                  />
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="truncate">
              {isSalaryColumn ? salaryValue : defaultRowValue}
            </p>
            <TooltipWrapper content="Edit Min Salary" delay={1500}>
              <Button
                size="icon"
                variant="link"
                className="hidden group-hover:block cursor-pointer "
                onClick={() => {
                  setIsEditing(true);
                }}
                title="Edit Min Salary"
                type="button"
              >
                <Edit2Icon />
              </Button>
            </TooltipWrapper>
          </>
        )}
      </div>
    </form>
  );
}
