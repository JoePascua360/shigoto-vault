import React, { useEffect, useState } from "react";
import DynamicDialog from "../dynamic-dialog";
import { useDialog } from "@/hooks/use-dialog";
import { Button } from "../ui/button";
import type { UpdateAndDeleteInterface } from "@/types/features/job-application/update-and-delete-interface";
import { Check, Edit2Icon, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import type { JobApplicationsColumn } from "@/features/job-applications/job-application-columns";
import { showToast } from "@/utils/show-toast";
import { TagInput, type Tag } from "emblor";
import { Badge } from "../ui/badge";
import { ErrorMessage } from "@hookform/error-message";
import { jobApplicationBaseEditSchema } from "#/schema/features/job-applications/job-application-editable-row-schema";
import { fetchRequestComponent } from "@/utils/fetch-request-component";

const formSchema = jobApplicationBaseEditSchema.extend({
  newValue: z.union([
    z
      .array(
        z.object({
          id: z.string().min(1, "ID should be provided!"),
          text: z.string().min(1, "Text should be provided!"),
        })
      )
      .min(1, "Array must contain at least one item!"),
    z.string().min(1, "New value is required!"),
  ]),
});

type formDataType = z.infer<typeof formSchema>;

/**
 *
 * @param item - list of tags
 * @param emptyItemText - specifies whether it
 * @returns
 */
const renderListOfTagOrRounds = (item: Tag[]) => {
  return (
    <>
      {item?.length > 0 ? (
        <>
          {item?.map((item, index) => (
            <div key={index} className="truncate">
              <Badge className="bg-secondary border border-primary text-primary w-full">
                <p>
                  {item.text.length > 15
                    ? `${item.text.slice(0, 16)}...`
                    : item.text}
                </p>
              </Badge>
            </div>
          ))}
        </>
      ) : (
        <p>No listed item.</p>
      )}
    </>
  );
};

interface EditTableDialogRowProps extends UpdateAndDeleteInterface {
  currentRowValue: string | Tag[];
  title: string;
  columnName: keyof JobApplicationsColumn;
}

export default function EditTableDialogRow({
  currentRowValue,
  title,
  columnName,
  row,
  table,
}: EditTableDialogRowProps) {
  const form = useForm<formDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      columnName: columnName,
      newValue: currentRowValue,
      rows: [row.id],
    },
  });

  const isTagOrRoundEmpty = form.getValues("newValue") === null;
  const editTableDialogRowDialog = useDialog();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [tags, setTags] = useState<Tag[]>(
    isTagOrRoundEmpty ? [] : (currentRowValue as Tag[])
  );
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: formDataType) => {
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
        "/updateDialogRow",
        "PATCH",
        {
          ...formData,
        }
      );

      setIsEditing(false);

      return { ...formData };
    },
    async onSuccess() {
      showToast("success", `${title} is successfully updated!`);
      form.reset();
      return await queryClient.invalidateQueries({
        queryKey: ["job-applications"],
      });
    },
    onError(error) {
      console.log(error);
      return showToast("error", error.message);
    },
  });

  return (
    <>
      <DynamicDialog
        dialog={editTableDialogRowDialog}
        title={`Job Application ${title}`}
        triggerElement={<Button variant="outline">View {title}</Button>}
        className={`overflow-auto ${
          isEditing ? "overflow-y-auto  h-[600px]" : ""
        }`}
      >
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          {!isEditing ? (
            <div
              className={`overflow-y-auto ${
                columnName === "job_description" ? "h-88" : ""
              } flex gap-2 flex-wrap w-full`}
            >
              {columnName === "job_description" ? (
                <p className="whitespace-pre-line font-sub-text break-normal text-left">
                  {typeof currentRowValue === "string" ? currentRowValue : ""}
                </p>
              ) : (
                renderListOfTagOrRounds(
                  typeof currentRowValue === "string" ? [] : currentRowValue
                )
              )}
            </div>
          ) : (
            <div>
              {columnName === "job_description" ? (
                <Textarea className="min-h-96" {...form.register("newValue")} />
              ) : (
                <>
                  <TagInput
                    {...form.register("newValue")}
                    id={columnName}
                    tags={tags}
                    setTags={(newTags) => {
                      setTags(newTags);
                      form.setValue("newValue", newTags as [Tag, ...Tag[]]);
                    }}
                    placeholder="Add a tag for this job application"
                    styleClasses={{
                      inlineTagsContainer:
                        "border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1",
                      input: "w-full min-w-[80px] shadow-none px-2 h-7",
                      tag: {
                        body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                        closeButton:
                          "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                      },
                    }}
                    truncate={10}
                    maxTags={10}
                    showCounter
                    activeTagIndex={activeTagIndex}
                    setActiveTagIndex={setActiveTagIndex}
                  />
                  <ErrorMessage
                    errors={form.formState.errors}
                    name={"newValue"}
                    render={({ message }) => {
                      return (
                        <p className="text-red-500 font-sub-text mt-2">
                          {message}
                        </p>
                      );
                    }}
                  />
                </>
              )}
            </div>
          )}

          <div className="flex justify-end">
            {!isEditing ? (
              <Button
                className="cursor-pointer"
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                <Edit2Icon /> Edit {title}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button className="cursor-pointer" type="submit">
                  <Check /> Submit
                </Button>

                <Button
                  className="cursor-pointer"
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setTags(
                      typeof currentRowValue === "string" ? [] : currentRowValue
                    );
                  }}
                >
                  <X /> Cancel
                </Button>
              </div>
            )}
          </div>
        </form>
      </DynamicDialog>
    </>
  );
}
