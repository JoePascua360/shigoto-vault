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
import { FaSpinner } from "react-icons/fa6";
import { fetchRequestComponent } from "@/utils/fetch-request-component";
import MultiStepFormWrapper from "@/components/multi-step-form-wrapper";
import { addJobApplicationFormElements } from "./add-job-application-form-elements";
import { z } from "zod/v4";
import { Textarea } from "@/components/ui/textarea";

interface AddJobApplicationProps<TDialog> {
  dialogProps: TDialog;
}

export default function AddJobApplication<TDialog>({
  dialogProps,
}: AddJobApplicationProps<TDialog>) {
  const form = useForm<jobApplicationData>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      company_name: "Company A",
      role: "Dev",
      job_description: "Seeking devs",
      min_salary: 50000,
      max_salary: 100000,
      location: "WFH",
      job_type: "Full-time",
      work_schedule: "8am to 5pm",
      tag: ["ideal job", "top company"],
      rounds: ["1st round", "2nd round"],
      status: "applied",
      applied_at: new Date(),
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: jobApplicationData) => {
    setIsLoading(true);

    try {
      const response = await fetchRequestComponent(
        "/addJobApplication",
        "POST",
        values
      );

      queryClient.invalidateQueries({
        queryKey: ["job-applications"],
        exact: true,
      });

      return showToast("success", response.message, {
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
            <MultiStepFormWrapper<keyof jobApplicationData>
              formArray={addJobApplicationFormElements}
              isLoading={isLoading}
              validateStep={async (step) => {
                setIsLoading(true);
                try {
                  const isValid = await form.trigger(
                    addJobApplicationFormElements[step - 1]?.fieldNameArray,
                    {
                      shouldFocus: true,
                    }
                  );

                  return isValid;
                } catch (error) {
                  if (error instanceof Error) {
                    return false;
                  } else {
                    return false;
                  }
                } finally {
                  setIsLoading(false);
                }
              }}
            />
          </form>
        </Form>
      </DynamicDialog>
    </>
  );
}
