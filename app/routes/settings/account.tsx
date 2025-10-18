import { NavLink, useNavigate } from "react-router";
import type { Route } from "./+types/account";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/config/auth-client";
import { Link, List, PcCase, Power, Verified } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MdEmail, MdPending, MdWarning } from "react-icons/md";
import { SiGmail, SiGooglecalendar } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import DropdownMenuComponent from "@/components/dropdown-component";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Spinner from "@/components/spinner";
import { UAParser } from "ua-parser-js";
import { showToast } from "@/utils/show-toast";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings | Shigoto Vault" },
    { name: "Settings", content: "Settings for managing user account" },
  ];
}

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const sessions = await authClient.listSessions();
  const accounts = await authClient.listAccounts();

  const listOfAccounts = accounts.data || [];

  const googleAccount = listOfAccounts.find((acc) => acc.provider === "google");

  const result = await authClient.accountInfo({
    accountId: googleAccount?.accountId || "",
  });

  const googleData = result.data;

  return { sessions: sessions.data, accounts: listOfAccounts, googleData };
}

export function HydrateFallback() {
  return <Spinner isLoading />;
}

export default function Account({ loaderData }: Route.ComponentProps) {
  const listOfSessions = loaderData.sessions || [];

  const { data: currentSession } = authClient.useSession();

  const isEmailVerified = currentSession?.user.emailVerified;

  const isGoogleLinked = loaderData.googleData !== null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center flex-wrap">
            <p>Manage Email Address</p>
            {isEmailVerified ? (
              <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                Email Verified
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
              <Button
                className="cursor-pointer"
                variant="secondary"
                disabled={isEmailVerified}
                onClick={async () => {
                  if (!isEmailVerified) {
                    await authClient.sendVerificationEmail({
                      email: currentSession?.user.email || "",
                      callbackURL: "/app/settings/account",
                    });

                    return showToast("success", "Email verification sent!");
                  }
                }}
              >
                <Verified />{" "}
                {isEmailVerified ? "Email Verified" : "Verify Email"}
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Card className="py-3.5">
            <CardHeader className="flex gap-2 justify-between items-center">
              <CardTitle className="flex gap-5">
                <Label>Email Address: </Label>
                <Input
                  placeholder={currentSession?.user.email}
                  className="w-96"
                />
              </CardTitle>
              <section className="flex gap-2">
                <Button>
                  <MdEmail />
                  Change Email
                </Button>
              </section>
            </CardHeader>
          </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Link Google Account</CardTitle>
          <CardDescription>
            Allows you to access Emails and Calendars page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Card className="py-3.5">
            <CardHeader className="flex gap-2 justify-between items-center">
              <CardTitle className="flex gap-3 items-center">
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
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                    Linked
                  </Badge>
                )}
              </CardTitle>
              <section className="flex gap-2">
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

      <Card>
        <CardHeader>
          <CardTitle>Manage Sessions</CardTitle>
          <CardDescription>
            You can see your sessions here. You can revoke any of this session
            here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {listOfSessions.length > 0 ? (
            <>
              {listOfSessions.map((item, index) => {
                const { browser, device, os } = UAParser(
                  item.userAgent || "No user agent"
                );

                return (
                  <Card className="py-3.5" key={index}>
                    <CardHeader className="flex gap-2 justify-between items-center">
                      <CardTitle className="flex gap-2">
                        {`${os.name}, ${browser.name}`}
                      </CardTitle>
                      <section className="flex gap-2">
                        {item.userAgent ===
                        currentSession?.session.userAgent ? (
                          <Button className="cursor-pointer" disabled>
                            <PcCase />
                            Current Session
                          </Button>
                        ) : (
                          <Button
                            className="cursor-pointer"
                            variant="destructive"
                            title="This action will log your account out of this device"
                          >
                            <Power />
                            Revoke
                          </Button>
                        )}
                      </section>
                    </CardHeader>
                  </Card>
                );
              })}
            </>
          ) : (
            <p>No list of sessions</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
