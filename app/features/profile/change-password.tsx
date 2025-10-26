import LoadingButton from "@/components/loading-button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authClient, type User } from "@/config/auth-client";
import { showToast } from "@/utils/show-toast";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaQuestion } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { z } from "zod/v4";
import PasswordInput from "./components/password-input";
import { useDialog } from "@/hooks/use-dialog";
import PasswordResetOtp from "./components/password-reset-otp";

const formData = z.object({
  currentPassword: z
    .string()
    .min(8, "Current Password must be 8 or more characters!"),
  newPassword: z.string().min(8, "New Password must be 8 or more characters!"),
  confirmNewPassword: z
    .string()
    .min(8, "Password must be 8 or more characters!"),
});

export type formDataType = z.infer<typeof formData>;

export default function ChangePassword({
  user,
  hasCredentialAccount,
}: {
  user: User | undefined;
  hasCredentialAccount: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formData),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
      currentPassword: "",
    },
  });

  const handleSubmit = async (formData: formDataType) => {
    const { error } = await authClient.changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      revokeOtherSessions: true,
    });
    if (error) {
      console.log(error.message);
      return showToast("error", error.message || "");
    }
    showToast(
      "success",
      "Password successfully changed! Please login using the new credentials."
    );
    await authClient.signOut();
    return navigate("/");
  };

  const resetPasswordDialog = useDialog();

  return (
    <>
      {/* Dialog for password reset (forgot password)*/}
      <PasswordResetOtp
        dialog={resetPasswordDialog}
        user={user}
        setIsLoading={setIsLoading}
      />

      {hasCredentialAccount && (
        <Card>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <section className="mb-5 flex flex-col gap-5">
                <article className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
                  <PasswordInput
                    form={form}
                    name="currentPassword"
                    text="Current Password"
                  />
                  <PasswordInput
                    form={form}
                    name="newPassword"
                    text="New Password"
                  />
                  <PasswordInput
                    form={form}
                    name="confirmNewPassword"
                    text="Confirm New Password"
                  />
                </article>
                <article className="flex flex-col gap-5 items-center">
                  <LoadingButton
                    isLoading={form.formState.isSubmitting}
                    text="Change Password"
                    type="submit"
                    icon={<Lock />}
                  />

                  <div className="relative  flex items-center justify-center overflow-hidden w-full">
                    <Separator />
                    <div className="py-1 px-2 border rounded-full text-center bg-muted text-xs mx-1">
                      OR
                    </div>
                    <Separator />
                  </div>
                  <LoadingButton
                    isLoading={isLoading}
                    text="Forgot Password"
                    type="button"
                    buttonConfig={{ variant: "secondary" }}
                    fn={async () => {
                      setIsLoading(true);
                      const { error } =
                        await authClient.forgetPassword.emailOtp({
                          email: user?.email || "", // required
                        });

                      if (error) {
                        console.log(error);
                        return showToast("error", error.message || "");
                      }

                      resetPasswordDialog.trigger();
                    }}
                    icon={<FaQuestion />}
                  />
                </article>
              </section>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
