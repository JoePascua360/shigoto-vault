import DynamicDialog from "@/components/dynamic-dialog";
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { type DialogType } from "@/hooks/use-dialog";
import type { UpdateAndDeleteInterface } from "@/types/features/job-application/update-and-delete-interface";
import { fetchRequestComponent } from "@/utils/fetch-request-component";
import { showToast } from "@/utils/show-toast";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

interface DeleteJobApplicationProps extends UpdateAndDeleteInterface {
  dialog: DialogType;
  queryClient: QueryClient;
}

export default function DeleteJobApplication({
  row,
  table,
  queryClient,
  dialog,
}: DeleteJobApplicationProps) {
  const mutation = useMutation({
    mutationFn: async () => {
      try {
        const rows: string[] =
          table.getSelectedRowModel().rows.length === 0
            ? [row.id]
            : table.getSelectedRowModel().rows.map((row) => row.id);

        const result = await fetchRequestComponent(
          "/deleteJobApplication",
          "DELETE",
          {
            rows,
          }
        );

        return result.data;
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          throw new Error(error.message);
        }
        throw new Error("Unknown error occurred");
      }
    },
    async onSuccess(data) {
      const length = data.length;
      showToast(
        "success",
        `${length} ${length > 1 ? "rows" : "row"} deleted successfully!`
      );
      return await queryClient.invalidateQueries({
        queryKey: ["job-applications"],
      });
    },
    onError: (error: Error) => {
      return showToast("error", error.message);
    },
  });

  return (
    <>
      <DynamicDialog
        dialog={dialog}
        title="Are you sure?"
        className="text-red-500"
        description="This action will permanently remove the selected job applications from the system. Once deleted, this data cannot be recovered."
      >
        <div className="flex justify-between">
          <p>Please think carefully before proceeding.</p>
          <LoadingButton
            isLoading={mutation.isPending}
            className="flex mt-10 cursor-pointer"
            buttonConfig={{ variant: "destructive" }}
            fn={() => {
              mutation.mutate();
              dialog.dismiss();
            }}
            type="button"
            text="Delete"
            icon={<Trash2 />}
          />
        </div>
      </DynamicDialog>
    </>
  );
}
