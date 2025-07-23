import DynamicDialog from "@/components/dynamic-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  frontendJobApplicationSchema,
  type FrontendJobApplicationData,
} from "#/schema/features/job-applications/job-application-schema";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useId, useState } from "react";
import { showToast } from "@/utils/show-toast";
import { fetchRequestComponent } from "@/utils/fetch-request-component";
import MultiStepFormWrapper from "@/components/multi-step-form-wrapper";
import { addJobApplicationFormElementsHook } from "./add-job-application-form-elements";
import type { DialogType, useDialog } from "@/hooks/use-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";

export default function AddJobApplication({ dialog }: DialogType) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FrontendJobApplicationData>({
    resolver: zodResolver(frontendJobApplicationSchema),
    defaultValues: {
      company_name: "",
      role: "",
      job_description: "",
      min_salary: 1,
      max_salary: 2,
      location: "",
      job_type: "Full-Time",
      work_schedule: "",
      tag: [
        {
          id: "1",
          text: "Ideal Job",
        },
      ],
      rounds: [
        {
          id: "1",
          text: "First Round",
        },
      ],
      status: "applied",
      applied_at: new Date(),
    },
  });

  const addJobApplicationFormElements = addJobApplicationFormElementsHook(form);

  const handleSubmit = async (values: FrontendJobApplicationData) => {
    setIsLoading(true);

    try {
      const response = await fetchRequestComponent(
        "/addJobApplication",
        "POST",
        values
      );

      await queryClient.invalidateQueries({
        queryKey: ["job-applications"],
        exact: true,
      });

      dialog.dismiss();

      return showToast("success", response.message, {
        label: "Undo",
        onClick: () => {
          console.log("Test");
        },
      });
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
        triggerElement={
          <Button>
            <Plus />
            Add Job Applications
          </Button>
        }
        dialog={dialog}
        description="You can add new job applications here. "
        title="Add Applications"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <MultiStepFormWrapper<keyof FrontendJobApplicationData>
              formArray={addJobApplicationFormElements}
              isLoading={isLoading}
              validateStep={async (step) => {
                setIsLoading(true);
                try {
                  // values from input tags is a string, need to convert it to a number
                  // to avoid the zod type error
                  form.setValue(
                    "min_salary",
                    Number(form.getValues("min_salary"))
                  );

                  form.setValue(
                    "max_salary",
                    Number(form.getValues("max_salary"))
                  );

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
