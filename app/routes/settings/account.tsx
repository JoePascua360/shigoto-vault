import type { Route } from "./+types/account";
import { authClient } from "@/config/auth-client";
import Spinner from "@/components/spinner";
import ManageEmail from "@/features/account/manage-email";
import LinkGoogleAccount from "@/features/account/link-google-account";
import ManageSessions from "@/features/account/manage-sessions";

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
  const isEmailVerified = currentSession?.user.emailVerified || false;
  const isGoogleLinked = loaderData.googleData !== null;

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

        <LinkGoogleAccount isGoogleLinked={isGoogleLinked} />

        <ManageSessions
          currentSession={currentSession}
          listOfSessions={listOfSessions}
        />
      </div>
    </>
  );
}
