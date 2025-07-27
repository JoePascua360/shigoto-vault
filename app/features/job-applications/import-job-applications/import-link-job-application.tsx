import {
  linkJobApplicationSchema,
  type linkJobApplicationData,
} from "#/schema/features/job-applications/link-job-application-schema";
import DynamicDialog from "@/components/dynamic-dialog";
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { useDialog } from "@/hooks/use-dialog";
import { fetchRequestComponent } from "@/utils/fetch-request-component";
import { showToast } from "@/utils/show-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Ban, Delete, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface ImportLinkJobApplicationProps {
  dialog: ReturnType<typeof useDialog>;
}

export default function ImportLinkJobApplication({
  dialog,
}: ImportLinkJobApplicationProps) {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<linkJobApplicationData>({
    resolver: zodResolver(linkJobApplicationSchema),
    defaultValues: {
      url: [{ jobList: "" }],
    },
  });

  const errorMsg = form.formState.errors.url
    ? form.formState.errors.url?.root?.message
    : "";

  const { fields, append, remove } = useFieldArray({
    name: "url",
    control: form.control,
    rules: {
      maxLength: 5,
      minLength: 1,
    },
  });

  const handleSubmit = async (values: linkJobApplicationData) => {
    setIsLoading(true);
    try {
      const response = await fetchRequestComponent(
        "/importLinkJobApplication",
        "POST",
        values
      );

      await queryClient.invalidateQueries({
        queryKey: ["job-applications"],
        exact: true,
      });

      dialog.dismiss();

      return showToast(
        "success",
        response.message,
        response.hasSkippedLinks ? Infinity : 4000
      );
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        return showToast("error", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DynamicDialog
        dialog={dialog}
        title="Import Through Links"
        description="Please paste the direct link of the job post URLs here."
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-3"
          >
            <p className="text-red-500 font-content">{errorMsg}</p>

            <main className="overflow-y-auto h-88 space-y-5">
              {fields.length > 0 ? (
                fields.map((field, index) => {
                  return (
                    <section key={field.id} className="space-y-2">
                      <FormField
                        name={`url.${index}.jobList`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job List URL #{index + 1}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Must be https:// to make the url work. (ex. https://indeed.com/)"
                                {...field}
                                tabIndex={index + 1}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash /> Delete
                      </Button>
                    </section>
                  );
                })
              ) : (
                <p>No URL fields added yet. Please add at least 1.</p>
              )}
            </main>

            <section className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (fields.length <= 5) {
                    append({
                      jobList: "",
                    });
                  }
                }}
                disabled={fields.length >= 5}
              >
                {fields.length >= 5 ? (
                  <>
                    <Ban /> Can't exceed 5.
                  </>
                ) : (
                  <>
                    <Plus /> Add More URL
                  </>
                )}
              </Button>
            </section>

            <footer className="flex justify-end">
              <LoadingButton isLoading={isLoading} type="submit" />
            </footer>
          </form>
        </Form>
      </DynamicDialog>
    </>
  );
}
