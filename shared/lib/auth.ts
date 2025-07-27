import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { pool } from "~/db/index";
import * as db from "~/db/index";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: pool,
  plugins: [
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        const anonymousId = anonymousUser.user.id;
        const newUserId = newUser.user.id;

        // Move job_applications of the anonymous user to the newly linked account.
        const queryCmd =
          "UPDATE job_applications SET user_id = $1 WHERE user_id = $2";

        await db.query(queryCmd, [newUserId, anonymousId]);
      },
      emailDomainName: "shigotovault.com",
      generateName: () => {
        return "Guest";
      },
    }),
  ],
  advanced: {
    cookiePrefix: "shigoto-vault",
  },
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "",
    process.env.BETTER_AUTH_LOCAL_IP || "",
  ],
});
