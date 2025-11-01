import type { auth } from "#/lib/auth";
import type { Account } from "better-auth";
import {
  anonymousClient,
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        twofactor: {
          type: "boolean",
          defaultValue: false,
        },
      },
    }),
    anonymousClient(),
    emailOTPClient(),
  ],
});

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
export type ListAccount = Omit<Account, "userId"> & { userId?: string };
