import DynamicDialog from "@/components/dynamic-dialog";
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DialogType } from "@/hooks/use-dialog";
import { fetchRequestComponent } from "@/utils/fetch-request-component";
import { showToast } from "@/utils/show-toast";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link2 } from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";

const formData = z.object({
  file: z.file().mime(["text/csv"]),
});

type formDataType = z.infer<typeof formData>;

interface ImportCsvFileJobApplicationProps {
  dialog: DialogType;
}

export default function ImportCsvFileJobApplication({
  dialog,
}: ImportCsvFileJobApplicationProps) {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formData),
  });

  const mutation = useMutation({
    mutationFn: async (data: formDataType) => {
      const formData = new FormData();

      formData.append("csvFile", data.file);

      const response = await fetchRequestComponent(
        "/job-applications",
        "/importCsv",
        "POST",
        formData
      );

      return response;
    },
    async onSuccess(data) {
      await queryClient.invalidateQueries({
        queryKey: ["job-applications"],
      });

      form.reset();
      dialog.dismiss();

      return showToast("success", data.message || "");
    },
    onError(error) {
      console.error(error);
      return showToast("error", error.message);
    },
  });

  return (
    <DynamicDialog
      dialog={dialog}
      description="You can drag your CSV/Excel file here to import your job applications"
      title="Import Through CSV file"
    >
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
        <Controller
          control={form.control}
          name="file"
          defaultValue={undefined}
          render={({ field }) => (
            <Input
              type="file"
              onChange={(e) => field.onChange(e.target.files?.[0])}
              ref={field.ref}
            />
          )}
        />

        <ErrorMessage
          name="file"
          errors={form.formState.errors}
          render={({ message }) => {
            return <p className="text-red-500 font-sub-text mt-2">{message}</p>;
          }}
        />
        <LoadingButton
          isLoading={mutation.isPending}
          className="flex justify-end mt-5"
        />
      </form>
    </DynamicDialog>
  );
}
