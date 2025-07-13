import { authClient } from "@/config/auth-client";
/**
 *
 * @param email - User Email Address (validated using zod in the form)
 * @param password - User Password (8 characters minimum)
 * @returns {object} User Data  - returns user data if successful and throws an error if not
 */
export async function userSignUp(
  email: string,
  password: string
): Promise<void> {
  await authClient.signUp.email(
    {
      email, // user email address
      password, // user password -> min 8 characters by default
      name: "Guest", // user display name
    },
    {
      onSuccess: (ctx) => {
        return ctx.data;
      },
      onError: (ctx) => {
        console.log(ctx.error.message);
        // display the error message
        throw new Error(ctx.error.message);
      },
    }
  );
}
