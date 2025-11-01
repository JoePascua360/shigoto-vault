import type { Route } from "./+types/account";
import { authClient } from "@/config/auth-client";
import Spinner from "@/components/spinner";
import ManageEmail from "@/features/account/manage-email";
import LinkGoogleAccount from "@/features/account/link-google-account";
import ManageSessions from "@/features/account/manage-sessions";
import { useState } from "react";
import { getUserAccounts } from "@/utils/get-user-accounts";

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const sessions = await authClient.listSessions();
  const data = await getUserAccounts();

  return {
    sessions: sessions.data,
    ...data,
  };
}

export function HydrateFallback() {
  return <Spinner isLoading />;
}

export default function Account({ loaderData }: Route.ComponentProps) {
  const { sessions, ...accountData } = loaderData;
  const listOfSessions = sessions || [];

  const { data: currentSession } = authClient.useSession();
  const isEmailVerified = currentSession?.user.emailVerified || false;

  const [isGoogleLinked, setIsGoogleLinked] = useState(
    accountData.googleAccountInfo !== null
  );

  return (
    <>
      <title>Account | Shigoto Vault</title>
      <meta property="og:title" content="Account | Shigoto Vault" />
      <meta
        name="description"
        content="Manage email, linked google account and sessions here."
      />

      <div className="flex flex-col gap-4 w-full">
        <ManageEmail
          currentSession={currentSession}
          isEmailVerified={isEmailVerified}
        />

        <LinkGoogleAccount
          isGoogleLinked={isGoogleLinked}
          setIsGoogleLinked={setIsGoogleLinked}
          user={currentSession?.user}
          account={{
            ...accountData,
            googleAccount: accountData.googleAccountInfo,
          }}
        />

        <ManageSessions
          currentSession={currentSession}
          listOfSessions={listOfSessions}
        />
      </div>
    </>
  );
}
