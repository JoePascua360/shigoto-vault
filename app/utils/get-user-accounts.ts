import { authClient } from "@/config/auth-client";

export async function getUserAccounts() {
  const accounts = await authClient.listAccounts();
  const listOfAccounts = accounts.data || [];
  const googleAccount = listOfAccounts.find(
    (acc) => acc.providerId === "google"
  );

  const credentialAccount = listOfAccounts.find(
    (acc) => acc.providerId === "credential"
  );

  const accountInfo = await authClient.accountInfo({
    accountId: googleAccount?.accountId || "",
  });

  const googleAccountInfo = accountInfo?.data;

  const hasGoogleAccount = listOfAccounts.length >= 1;

  return {
    googleAccountInfo,
    hasGoogleAccount,
    listOfAccounts,
    credentialAccount,
  };
}
