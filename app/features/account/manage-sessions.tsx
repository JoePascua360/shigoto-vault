import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Session } from "@/config/auth-client";
import { useIsMobile } from "@/hooks/use-mobile";
import { PcCase, Power } from "lucide-react";
import { UAParser } from "ua-parser-js";

export default function ManageSessions({
  listOfSessions,
  currentSession,
}: {
  listOfSessions: Session["session"][];
  currentSession: Session | null;
}) {
  const isMobile = useIsMobile();

  return (
    <>
      {!currentSession?.user.isAnonymous && (
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
                      <CardHeader className="flex gap-2 justify-between items-center flex-wrap">
                        <CardTitle className="flex gap-2">
                          {`${os.name}, ${browser.name}`}
                        </CardTitle>
                        <section className="flex gap-2">
                          {item.userAgent ===
                          currentSession?.session.userAgent ? (
                            <Button className="cursor-pointer" disabled>
                              <PcCase />
                              {isMobile ? "Current" : "Current Session"}
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
      )}
    </>
  );
}
