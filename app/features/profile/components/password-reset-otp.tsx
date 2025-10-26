import DynamicDialog from "@/components/dynamic-dialog";
import type { DialogType } from "@/hooks/use-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import LoadingButton from "@/components/loading-button";
import { authClient, type User } from "@/config/auth-client";
import { showToast } from "@/utils/show-toast";
import MultiStepFormWrapper from "@/components/multi-step-form-wrapper";
import type { MultiStepFormArray } from "@/types/multi-step-form-array";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PasswordInput from "./password-input";
import { useState } from "react";
import { useNavigate } from "react-router";

const formData = z.object({
  otp: z.string().length(6, "Must be exactly 6 digits."),
  newPassword: z.string().min(8, "Must be at least 8 characters!"),
});

type formDataType = z.infer<typeof formData>;

export default function PasswordResetOtp({
  dialog,
  user,
  setIsLoading,
}: {
  dialog: DialogType;
  user: User | undefined;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [attempts, setAttempts] = useState(2);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formData),
    defaultValues: {
      otp: "",
      newPassword: "",
    },
  });

  const formArray: Array<MultiStepFormArray<keyof formDataType>> = [
    {
      element: (
        <div className="flex justify-center my-10">
          <Controller
            name="otp"
            control={form.control}
            render={({ field }) => (
              <>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </>
            )}
          />
        </div>
      ),
      title: {
        text: "One Time Pin",
        className: "font-bold text-xl",
      },
      contentClassName: "",
      fieldNameArray: ["otp"],
    },
    {
      element: (
        <>
          <PasswordInput form={form} name="newPassword" text="New Password" />
        </>
      ),
      title: {
        text: "Password Reset",
        className: "font-bold text-xl",
      },
      contentClassName: "",
      fieldNameArray: ["newPassword"],
    },
  ];

  const handleSubmit = async (data: formDataType) => {
    const { error } = await authClient.emailOtp.resetPassword({
      email: user?.email || "",
      otp: data.otp,
      password: data.newPassword,
    });

    if (error) {
      console.log(error);
      return showToast("error", error.message || "");
    }

    showToast("success", "Password reset successful! Please login again.");

    await authClient.signOut();
    return navigate("/");
  };

  return (
    <DynamicDialog
      dialog={dialog}
      closeOnClickOutside={false}
      title="Reset Password"
      description="Please type the OTP received in your email for confirmation and your new password."
    >
      <>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <MultiStepFormWrapper
            formArray={formArray}
            isLoading={form.formState.isSubmitting}
            validateStep={async () => {
              const { error } = await authClient.emailOtp.checkVerificationOtp({
                email: user?.email || "",
                type: "forget-password",
                otp: form.getValues("otp"),
              });

              if (error) {
                console.log(error);
                if (error.code === "INVALID_OTP") {
                  setAttempts((prev) => prev - 1);
                  const extraMsg =
                    attempts <= 0
                      ? `No attempts left. Please request a new otp.`
                      : `You have ${attempts} attempts left.`;

                  showToast("error", `${error.message}. ${extraMsg}`);
                  return false;
                }
                showToast("error", error.message || "");
                return false;
              }

              return true;
            }}
          />
        </form>
      </>
    </DynamicDialog>
  );
}
