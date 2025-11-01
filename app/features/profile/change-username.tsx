import LoadingButton from "@/components/loading-button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, type User } from "@/config/auth-client";
import { showToast } from "@/utils/show-toast";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChangeUsername({ user }: { user: User | undefined }) {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(user?.name);
  const isMobile = useIsMobile();

  const changeUsername = async () => {
    setIsLoading(true);
    try {
      if (username === user?.name) {
        return showToast(
          "warning",
          "New username must be different from current username!"
        );
      }
      await authClient.updateUser({
        name: username,
      });
      return showToast("success", "Updated Successfully!");
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
        <CardTitle className="flex gap-2 flex-wrap sm:flex-nowrap">
          <div className="space-y-2 w-full">
            <Label>Display Name</Label>
            <Input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  await changeUsername();
                }
              }}
              className="w-full"
            />
          </div>
          <LoadingButton
            isLoading={isLoading}
            text="Change"
            type="button"
            fn={changeUsername}
            icon={<Edit />}
            className="mt-auto"
          />
        </CardTitle>
        <div className="flex items-center mt-2">
          <Label className="flex items-center gap-6 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
            <div className="flex flex-col gap-1">
              <p className="text-sm leading-4">
                {isMobile ? "2FA" : "Two Factor Authentication"}
              </p>
              <p className="text-xs text-muted-foreground">
                Send a one-time passcode (OTP) to your email every sign in
              </p>
            </div>
            <Switch
              defaultChecked={user?.twofactor}
              onCheckedChange={async (value) => {
                const { error } = await authClient.updateUser({
                  twofactor: value,
                });

                if (error) {
                  console.log(error);
                  return showToast("error", error.message || "");
                }

                return showToast(
                  "success",
                  `${value ? "2FA enabled!" : "2FA disabled!"}`
                );
              }}
            />
          </Label>
        </div>
      </CardHeader>
    </Card>
  );
}
