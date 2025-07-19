import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";
import { FaSpinner } from "react-icons/fa6";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Check } from "lucide-react";

interface MultiStepFormWrapperProps<T> {
  formArray: Array<{
    element: React.ReactElement;
    title: {
      text: string;
      className: string;
    };
    contentClassName: string;
    fieldNameArray: Array<T>;
  }>;
  isLoading: boolean;
  validateStep: (step: number) => Promise<boolean>;
}

export default function MultiStepFormWrapper<T>({
  formArray,
  isLoading,
  validateStep,
}: MultiStepFormWrapperProps<T>) {
  const [step, setStep] = useState<number>(1);

  const currentStep = formArray[step - 1];

  return (
    <main className="space-y-5">
      <header className="flex gap-1 w-full">
        {Array.from({ length: formArray.length }).map((_, index) => {
          const activeColors = "bg-primary text-white dark:text-black";

          const activeState =
            step === index + 1 ? activeColors : "bg-secondary";

          const finishedState = step > index + 1 ? activeColors : "";

          return (
            <article
              className={`flex justify-between gap-1 items-center ${
                index + 1 === formArray.length ? "" : "w-full"
              }`}
              key={index}
            >
              <section>
                <Avatar className="size-7">
                  <AvatarFallback
                    className={`text-sm font-sub-text ${activeState} ${finishedState}`}
                  >
                    {step > index + 1 ? (
                      <Check size={15} />
                    ) : (
                      <p>{index + 1}</p>
                    )}
                  </AvatarFallback>
                </Avatar>
              </section>
              {index + 1 < formArray.length && (
                <section className="w-full">
                  <Separator
                    className={`data-[orientation=horizontal]:h-1 bg-secondary ${
                      step > index + 1 ? "bg-primary" : ""
                    } `}
                  />
                </section>
              )}
            </article>
          );
        })}
      </header>

      <section>
        {formArray.length > 0 && (
          <article>
            <section className="flex justify-center">
              <h2
                className={`font-secondary-header ${currentStep?.title?.className}`}
              >
                {currentStep?.title?.text}
              </h2>
            </section>
            {/* // steps - 1 since array starts from zero. Step value needs to match it */}
            <section
              key={step}
              className={`${formArray[step - 1]?.contentClassName}`}
            >
              {currentStep?.element}
            </section>
          </article>
        )}
      </section>

      <footer className="flex justify-between">
        {/* step starts at 1, meaning there's no previous button */}
        <Button
          disabled={step === 1}
          onClick={() => setStep((step) => step - 1)}
          type="button"
          variant="secondary"
        >
          Previous
        </Button>

        {/* check if current step is final step, show the final submit button */}
        {step === formArray.length && (
          <Button disabled={isLoading} type="submit">
            {isLoading && (
              <FaSpinner className={`${isLoading ? "animate-spin" : ""}`} />
            )}
            Submit
          </Button>
        )}

        {/* will render as long as current step is not final step */}
        {step >= 1 && step < formArray.length && (
          <Button
            type="button"
            disabled={isLoading}
            onClick={async () => {
              try {
                const isValidStep = await validateStep(step);

                if (!isValidStep) {
                  const errorMsg =
                    "Input is invalid! Cannot proceed to next step!";
                  throw new Error(errorMsg);
                }

                setStep((step) => step + 1);
              } catch (error) {
                if (error instanceof Error) {
                  console.log(error);
                  throw new Error(error.message);
                }
              }
            }}
          >
            {isLoading && (
              <FaSpinner className={`${isLoading ? "animate-spin" : ""}`} />
            )}
            Next
          </Button>
        )}
      </footer>
    </main>
  );
}
