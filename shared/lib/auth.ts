import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { pool } from "~/db/index";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: pool,
  plugins: [
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {},
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
