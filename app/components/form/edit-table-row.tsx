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
import { showToast, type showToastParams } from "@/utils/show-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { capitalizeFirstLetter } from "better-auth/react";
import type { UpdateAndDeleteInterface } from "@/types/features/job-application/update-and-delete-interface";

interface EditTableRowProps extends UpdateAndDeleteInterface {
  /**
   * @param rowValue - the value from `row.getValue` or `row.original`
   */
  rowValue: number | string | undefined;
  /**
   * @param columnName - column to be updated in the server
   */
  columnName: keyof JobApplicationsColumn;
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
  const isSalaryColumn = ["min_salary", "max_salary"].includes(columnName);

  const salaryValue =
    isSalaryColumn && rowValue !== undefined
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
      newValue: isSalaryColumn && rowValue === undefined ? 0 : defaultRowValue,
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

        await fetchRequestComponent(
          "/job-applications",
          "/updateRow",
          "PATCH",
          {
            ...formData,
          }
        );

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

      const rows: string[] =
        table.getSelectedRowModel().rows.length === 0
          ? [row.id]
          : table.getSelectedRowModel().rows.map((row) => row.id);

      const undoObject: showToastParams = {
        label: "Undo",
        async onClick() {
          try {
            const { columnName, isSalaryColumn } = data;

            // revert back to old row value.
            await fetchRequestComponent(
              "/job-applications",
              "/updateRow",
              "PATCH",
              {
                newValue: defaultRowValue,
                columnName,
                isSalaryColumn,
                rows,
              }
            );

            await queryClient.invalidateQueries({
              queryKey: ["job-applications"],
            });

            return showToast(
              "info",
              `${length} ${
                length > 1 ? "rows" : "row"
              } restored to previous value.`
            );
          } catch (error) {
            if (error instanceof Error) {
              console.log(error);

              return showToast("error", error.message);
            }
          }
        },
      };

      showToast(
        "success",
        `${length} ${length > 1 ? "rows" : "row"} updated successfully!`,
        6000,
        undoObject
      );

      await queryClient.invalidateQueries({ queryKey: ["job-applications"] });
    },
    onError: (error: Error) => {
      console.log(error);
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
      console.log(errors.newValue?.message);
      showToast("error", errors.newValue.message || "", 1500);
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <div className="flex items-center gap-2 group">
        {isEditing ? (
          <>
            <Input
              {...register("newValue", {
                valueAsNumber: isSalaryColumn,
                onChange(e) {
                  const val = e.target.value;
                  setValue("newValue", val);

                  if (val !== "Not Specified" && val !== rowValue) {
                    setIsEditing(true);
                  } else {
                    setIsEditing(false);
                  }
                },
              })}
              type={isSalaryColumn ? "number" : "text"}
              className="border-none shadow-none dark:bg-transparent"
              tabIndex={1}
            />

            <div className="flex gap-2">
              {mutation.isPending ? (
                <FaSpinner size={20} className="animate-spin" />
              ) : (
                <>
                  <button
                    type="submit"
                    className="hover:bg-green-300 dark:hover:bg-green-600 transition-colors delay-100 rounded-full p-1"
                  >
                    <SaveIcon
                      size={20}
                      tabIndex={2}
                      className="cursor-pointer"
                      aria-label="Save Changes"
                    />
                  </button>

                  <div className="hover:bg-red-500 transition-colors delay-100 rounded-full p-1 flex items-center">
                    <XIcon
                      size={20}
                      tabIndex={3}
                      className="cursor-pointer"
                      aria-label="Cancel"
                      onClick={() => {
                        setValue(
                          "newValue",
                          isSalaryColumn && rowValue === undefined
                            ? 0
                            : defaultRowValue
                        );
                        setIsEditing(false);
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="truncate">
              {isSalaryColumn && rowValue !== undefined
                ? salaryValue
                : defaultRowValue}
            </p>

            <Button
              size="icon"
              variant="link"
              className="hidden group-hover:flex cursor-pointer hover:bg-primary hover:text-white dark:hover:text-black rounded-full"
              onClick={() => {
                setIsEditing(true);
              }}
              title={`Edit ${capitalizeFirstLetter(columnName)}`}
              type="button"
            >
              <Edit2Icon />
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
