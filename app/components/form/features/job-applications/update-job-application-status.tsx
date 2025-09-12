import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import type { Row, Table } from "@tanstack/react-table";
import { fetchRequestComponent } from "@/utils/fetch-request-component";
import { showToast } from "@/utils/show-toast";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  statusColors,
  type JobApplicationsColumn,
} from "@/features/job-applications/job-application-columns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  jobApplicationUpdateStatusSchema,
  type UpdateStatus,
} from "#/schema/features/job-applications/job-application-update-status-schema";
import type { UpdateAndDeleteInterface } from "@/types/features/job-application/update-and-delete-interface";

interface UpdateJobApplicationStatusProps extends UpdateAndDeleteInterface {
  queryClient: QueryClient;
}

export default function UpdateJobApplicationStatus({
  row,
  table,
  queryClient,
}: UpdateJobApplicationStatusProps) {
  const form = useForm({
    resolver: zodResolver(jobApplicationUpdateStatusSchema),
    defaultValues: {
      rows: [row.id],
      status: row.original?.status || "bookmarked",
    },
  });

  const statusArr: (typeof row.original.status)[] = [
    "employed",
    "rejected",
    "applied",
    "bookmarked",
    "ghosted",
    "waiting for result",
  ];

  const mutation = useMutation({
    mutationFn: async (data: UpdateStatus) => {
      try {
        const rows: string[] =
          table.getSelectedRowModel().rows.length === 0
            ? [row.id]
            : table.getSelectedRowModel().rows.map((row) => row.id);

        const response = await fetchRequestComponent(
          "/updateJobApplicationStatus",
          "PATCH",
          { status: data.status, rows }
        );

        return { message: response?.message || "" };
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          throw new Error(error.message);
        }
        throw new Error("Unknown error occurred");
      }
    },
    async onSuccess(data) {
      showToast("success", data.message);
      return await queryClient.invalidateQueries({
        queryKey: ["job-applications"],
      });
    },
    onError: (error: Error) => {
      return showToast("error", error.message);
    },
  });

  return (
    <DropdownMenuRadioGroup
      {...(form.register("status"),
      {
        onValueChange(value) {
          form.setValue("status", value as UpdateStatus["status"]);

          form.handleSubmit((data) => mutation.mutate(data))();
        },
        value: row.original.status,
      })}
    >
      {statusArr.map((status, index) => {
        const textColor = statusColors[status].split(" ")[1];
        const darkTextColor = statusColors[status].split(" ")[2];

        return (
          <DropdownMenuRadioItem
            className={`${textColor} focus:${textColor} ${darkTextColor} capitalize`}
            key={index}
            value={status}
          >
            {status}
          </DropdownMenuRadioItem>
        );
      })}
    </DropdownMenuRadioGroup>
  );
}
