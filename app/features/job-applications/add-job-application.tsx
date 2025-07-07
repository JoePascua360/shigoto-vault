import DynamicDialog from "@/components/dynamic-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  jobApplicationSchema,
  type jobApplicationData,
} from "#/schema/features/job-applications/job-application-schema";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { showToast } from "@/utils/show-toast";
import { queryClient } from "@/root";

interface AddJobApplicationProps<TDialog> {
  dialogProps: TDialog;
}

export default function AddJobApplication<TDialog>({
  dialogProps,
}: AddJobApplicationProps<TDialog>) {
  const form = useForm<jobApplicationData>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      company_name: "hello",
    },
  });

  const [loading, setIsLoading] = useState(false);

  const handleSubmit = async (values: jobApplicationData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/addJobApplication", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      queryClient.invalidateQueries({
        queryKey: ["job-applications"],
        exact: true,
      });

      return showToast("success", data.message, {
        label: "Undo",
        onClick: () => {
          console.log("Test");
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        return showToast("error", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DynamicDialog
        triggerElement={
          <Button>
            <Plus />
            Add Job Applications
          </Button>
        }
        dialog={dialogProps}
        description="You can add new job applications here. "
        title="Add Applications"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DynamicDialog>
    </>
  );
}
