import { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit2Icon, SaveIcon, XIcon } from "lucide-react";
import { useFetcher } from "react-router";
import { FaSpinner } from "react-icons/fa6";
import TooltipWrapper from "../tooltip-wrapper";
import type { JobApplicationsColumn } from "@/features/job-applications/job-application-columns";
import type { Row, Table } from "@tanstack/react-table";

interface EditTableRowProps {
  /**
   * @param rowValue - the value from `row.getValue` or `row.original`
   */
  rowValue: string | undefined;
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
 *
 * @returns {JSX.Element}
 */
export default function EditTableRow({
  rowValue,
  columnName,
  table,
  row,
}: EditTableRowProps) {
  const [newValue, setNewValue] = useState(
    rowValue === undefined ? "Not Specified" : rowValue
  );

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const rows: Row<JobApplicationsColumn>[] | string[] =
    table.getSelectedRowModel().rows.length === 0
      ? [row.id]
      : table.getSelectedRowModel().rows;

  let fetcher = useFetcher();
  let busy = fetcher.state !== "idle";

  return (
    <fetcher.Form method="POST">
      <div className="flex items-center group gap-2">
        <div>
          <Input
            value={newValue}
            ref={inputRef}
            onChange={(e) => {
              setNewValue(e.target.value);
              if (
                e.target.value !== "Not Specified" &&
                e.target.value !== rowValue
              ) {
                setIsEditing(true);
              } else {
                setIsEditing(false);
              }
            }}
            name="min_salary"
            className="border-none shadow-none dark:bg-transparent"
          />
          {fetcher.data?.error && (
            <p className="text-red-500 font-sub-text text-base">
              {fetcher.data.error}
            </p>
          )}
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            {busy ? (
              <FaSpinner size={20} className="animate-spin" />
            ) : (
              <button
                type="button"
                onClick={() => {
                  const formData = new FormData();
                  formData.append("editedValue", newValue);
                  formData.append("columnName", columnName);
                  formData.append("rows", JSON.stringify(rows));

                  fetcher.submit(formData, {
                    method: "POST",
                  });
                }}
              >
                <SaveIcon
                  size={20}
                  className="cursor-pointer"
                  aria-label="Save Changes"
                />
              </button>
            )}

            <XIcon
              size={20}
              className="cursor-pointer"
              aria-label="Cancel"
              onClick={() => {
                setNewValue(
                  rowValue === undefined ? "Not Specified" : rowValue
                );
                setIsEditing(false);
              }}
            />
          </div>
        ) : (
          <TooltipWrapper content="Edit Min Salary" delay={1500}>
            <Button
              size="icon"
              variant="link"
              className="hidden group-hover:block cursor-pointer"
              onClick={() => {
                inputRef.current?.focus();
              }}
              title="Edit Min Salary"
              type="button"
            >
              <Edit2Icon />
            </Button>
          </TooltipWrapper>
        )}
      </div>
    </fetcher.Form>
  );
}
