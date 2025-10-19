import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MdEmail, MdWarning } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { authClient, type Session } from "@/config/auth-client";
import { showToast } from "@/utils/show-toast";
import { Verified } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import LoadingButton from "@/components/loading-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { email, z } from "zod/v4";
import { ErrorMessage } from "@hookform/error-message";
import { useIsMobile } from "@/hooks/use-mobile";

const formData = z.object({
  email: z.email().min(1, "Email is required!"),
});

export default function ManageEmail({
  isEmailVerified,
  currentSession,
}: {
  isEmailVerified: boolean;
  currentSession: Session | null;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const isAnonymous = currentSession?.user.isAnonymous || false;
  const isMobile = useIsMobile();

  const form = useForm({
    resolver: zodResolver(formData),
    defaultValues: {
      email: isAnonymous ? "" : currentSession?.user.email || "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formData>) => {
    try {
      if (currentSession?.user.email === data.email) {
        throw new Error("New email must be different from current email!");
      }

      await authClient.changeEmail({
        newEmail: data.email,
        callbackURL: "/app/settings/account",
      });

      return showToast(
        "success",
        "Confirmation email sent. Follow the instructions in your inbox to complete the change.",
        5000
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        return showToast("error", error.message);
      }
    }
  };

  return (
    <Card>
      <CardHeader
        className={`${
          isMobile
            ? "flex flex-col flex-wrap  sm:flex-nowrap justify-between"
            : ""
        }`}
      >
        <CardTitle className="flex gap-2 items-center flex-wrap">
          <p>Manage Email Address</p>
          {isEmailVerified ? (
            <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Email
              Verified
            </Badge>
          ) : (
            <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full">
              {" "}
              <MdWarning />
              Email Not Verified
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          You can verify or change your email address in this section.
        </CardDescription>
        <CardAction>
          <div className="flex gap-2 items-center">
            <LoadingButton
              isDisabled={isEmailVerified || isAnonymous}
              isLoading={isLoading}
              fn={async () => {
                setIsLoading(true);
                try {
                  if (!isEmailVerified && !isAnonymous) {
                    await authClient.sendVerificationEmail({
                      email: currentSession?.user.email || "",
                      callbackURL: "/app/settings/account",
                    });

                    return showToast("success", "Email verification sent!");
                  }
                } catch (error) {
                  if (error instanceof Error) {
                    console.error(error);
                    return showToast("error", error.message);
                  }
                } finally {
                  setIsLoading(false);
                }
              }}
              icon={<Verified />}
              text={isEmailVerified ? "Email Verified" : "Verify Email"}
              type="button"
              buttonConfig={{ variant: "secondary" }}
            />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Card className="py-3.5">
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardHeader className="flex flex-wrap gap-3 justify-between items-center">
              <CardTitle>
                <div className="flex flex-col gap-3 justify-center">
                  <Label>Email Address: </Label>
                  <Input
                    placeholder={
                      currentSession?.user.isAnonymous
                        ? "You need to sign up for an account first."
                        : currentSession?.user.email
                    }
                    {...form.register("email")}
                    disabled={currentSession?.user.isAnonymous || false}
                    className="truncate w-full lg:w-96"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  errors={form.formState.errors}
                  render={({ message }) => {
                    return (
                      <p className="flex justify-center text-red-500 font-sub-text mt-2">
                        {message}
                      </p>
                    );
                  }}
                />
              </CardTitle>

              <section className="flex gap-2">
                <LoadingButton
                  isLoading={form.formState.isSubmitting}
                  // isDisabled={isAnonymous}
                  icon={<MdEmail />}
                  text="Change"
                />
              </section>
            </CardHeader>
          </form>
        </Card>
      </CardContent>
    </Card>
  );
}
