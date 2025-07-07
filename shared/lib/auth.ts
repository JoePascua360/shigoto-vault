import { betterAuth } from "better-auth";
import { pool } from "~/db/index";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: pool,
});
