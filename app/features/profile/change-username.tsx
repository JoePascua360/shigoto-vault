import LoadingButton from "@/components/loading-button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/config/auth-client";
import { showToast } from "@/utils/show-toast";
import { Edit } from "lucide-react";
import { useState } from "react";

export default function ChangeUsername({
  defaultUsername,
}: {
  defaultUsername: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(defaultUsername);

  const changeUsername = async () => {
    setIsLoading(true);
    try {
      if (username === defaultUsername) {
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
      </CardHeader>
    </Card>
  );
}
