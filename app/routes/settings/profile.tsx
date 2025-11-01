import type { Route } from "./+types/profile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Spinner from "@/components/spinner";
import { authClient } from "@/config/auth-client";
import ProfileHeader from "@/features/profile/profile-header";
import ChangePassword from "@/features/profile/change-password";
import ChangeUsername from "@/features/profile/change-username";
import { getUserAccounts } from "@/utils/get-user-accounts";
export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const { googleAccountInfo, credentialAccount } = await getUserAccounts();

  const hasCredentialAccount = credentialAccount !== undefined;

  return { googleInfo: googleAccountInfo, hasCredentialAccount };
}

export function HydrateFallback() {
  return <Spinner isLoading />;
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const accountData = authClient.useSession().data;
  const imageSrc = loaderData.googleInfo?.user.image;

  return (
    <Card className="w-full lg:w-[80%] xl:w-[60%] relative overflow-hidden">
      <CardHeader>
        <ProfileHeader imageSrc={imageSrc} />
      </CardHeader>
      <CardContent className="mb-20">
        <main className="grid gap-2">
          <section className="space-y-5">
            <article>
              <ChangeUsername user={accountData?.user} />
            </article>
            <article className="flex flex-col gap-2">
              <ChangePassword
                user={accountData?.user}
                hasCredentialAccount={loaderData.hasCredentialAccount}
              />
            </article>
          </section>
        </main>
      </CardContent>

      {/* simple design for the card */}
      <div
        className="hidden xl:block h-40 w-40 bg-secondary absolute -top-15 -left-15 rounded-full"
        aria-label="top left design sphere"
      ></div>
      <div
        className="hidden xl:block h-40 w-40 bg-secondary absolute -top-15 -right-15 rounded-full z-0"
        aria-label="top right design sphere"
      ></div>
    </Card>
  );
}
