import { betterAuth } from "better-auth";
import { anonymous, emailOTP } from "better-auth/plugins";
import { pool } from "~/db/index";
import * as db from "~/db/index";
import { sendEmail } from "~/utils/send-email";

export const auth = betterAuth({
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "email-password"],
      allowDifferentEmails: false,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log(url);
      await sendEmail(
        { subject: "Your Email Verification", to: user.email },
        url
      );
    },
  },
  socialProviders: {
    google: {
      prompt: "consent",
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY || "",
      scopes: [
        "email",
        "profile",
        "https://mail.google.com/",
        "https://www.googleapis.com/auth/calendar",
      ],
    },
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
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          console.log(otp);
          // Send the OTP for sign in
        } else if (type === "email-verification") {
          console.log(otp, email);
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
        }
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
