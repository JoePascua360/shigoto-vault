import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, List, Unlink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SiGmail, SiGooglecalendar } from "react-icons/si";
import DropdownMenuComponent from "@/components/dropdown-component";
import { Badge } from "@/components/ui/badge";
import { MdPending } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { authClient, type User } from "@/config/auth-client";
import LoadingButton from "@/components/loading-button";
import { showToast } from "@/utils/show-toast";

export default function LinkGoogleAccount({
  isGoogleLinked,
  setIsGoogleLinked,
  user,
  listOfAccounts,
}: {
  isGoogleLinked: boolean;
  setIsGoogleLinked: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | undefined;
  listOfAccounts: {}[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const isAnonymous = user?.isAnonymous || false;

  const linkAccount = async () => {
    setIsLoading(true);
    try {
      if (!isGoogleLinked) {
        await authClient.linkSocial({
          provider: "google",
          callbackURL: "/app/settings/account",
          errorCallbackURL: "/app/settings/account",
        });
      }
      // allow unlinking if user has two accounts (credential and google account)
      else if (isGoogleLinked && listOfAccounts.length > 1) {
        await authClient.unlinkAccount({
          providerId: "google",
        });
        setIsGoogleLinked(false);

        return showToast("success", "Google account unlinked successfully!");
      }
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
    <Card>
      <CardHeader>
        <CardTitle>Link Google Account</CardTitle>
        <CardDescription>
          Allows you to access Emails and Calendars page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="py-3.5">
          <CardHeader className="flex gap-4 justify-between items-center flex-wrap">
            <CardTitle className="flex gap-3 items-center flex-wrap">
              <div className="flex gap-2">
                <FcGoogle /> Google{" "}
              </div>
              {!isGoogleLinked ? (
                <Badge className="bg-gray-600/10 dark:bg-gray-600/20 hover:bg-gray-600/10 text-gray-500 border-gray-600/60 shadow-none rounded-full">
                  {" "}
                  <MdPending />
                  Not Linked
                </Badge>
              ) : (
                <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
                  {" "}
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                  Linked
                </Badge>
              )}
            </CardTitle>
            <section className="flex gap-3 flex-wrap">
              <DropdownMenuComponent
                contentAlignment="start"
                triggerText="Scopes"
                triggerConfig={{ variant: "secondary" }}
                icon={<List />}
                className="font-subtext"
              >
                <>
                  <DropdownMenuItem>
                    <SiGooglecalendar className="size-6 text-blue-600" />
                    Google Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SiGmail className="size-6 text-red-600" />
                    Gmail
                  </DropdownMenuItem>
                </>
              </DropdownMenuComponent>

              {isAnonymous ? (
                <LoadingButton
                  isLoading={false}
                  buttonConfig={{ variant: "destructive" }}
                  text="Sign in required"
                  isDisabled={true}
                  icon={<X />}
                />
              ) : (
                <LoadingButton
                  isLoading={isLoading}
                  isDisabled={listOfAccounts.length === 1}
                  buttonConfig={{
                    variant: !isGoogleLinked ? "default" : "destructive",
                  }}
                  icon={!isGoogleLinked ? <Link /> : <Unlink />}
                  text={!isGoogleLinked ? "Link" : "Unlink"}
                  fn={linkAccount}
                />
              )}
            </section>
          </CardHeader>
        </Card>
      </CardContent>
    </Card>
  );
}
