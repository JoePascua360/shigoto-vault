import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SiGmail, SiGooglecalendar } from "react-icons/si";
import DropdownMenuComponent from "@/components/dropdown-component";
import { Badge } from "@/components/ui/badge";
import { MdPending } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/config/auth-client";

export default function LinkGoogleAccount({
  isGoogleLinked,
}: {
  isGoogleLinked: boolean;
}) {
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

              <Button
                className="cursor-pointer"
                disabled={isGoogleLinked}
                onClick={async () => {
                  if (!isGoogleLinked) {
                    await authClient.linkSocial({
                      provider: "google",
                      callbackURL: "/app/settings/account",
                      errorCallbackURL: "/app/settings/account",
                    });
                  }
                }}
              >
                <Link />
                Link
              </Button>
            </section>
          </CardHeader>
        </Card>
      </CardContent>
    </Card>
  );
}
