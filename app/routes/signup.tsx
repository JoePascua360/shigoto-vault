import { NavLink, redirect } from "react-router";
import type { Route } from "./+types/signup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaGithub, FaGoogle, FaSpinner } from "react-icons/fa";
import { authClient } from "@/config/auth-client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod/v4";
import { Separator } from "@/components/ui/separator";
import { showToast } from "@/utils/show-toast";
import { useState } from "react";

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_EXPRESS };
}

const formSchema = z.object({
  email: z.email().min(1, "Email is required!"),
  password: z.string().min(1, "Password is required!"),
});

export default function SignUp({ loaderData }: Route.ComponentProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const [isLoading, setIsIsLoading] = useState(false);

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const email = value.email;
      const password = value.password;

      const { data, error } = await authClient.signUp.email(
        {
          email, // user email address
          password, // user password -> min 8 characters by default
          name: "someone", // user display name
          callbackURL: "/dashboard", // A URL to redirect to after the user verifies their email (optional)
        },
        {
          onRequest: (ctx) => {
            setIsIsLoading(true);

            //show loading
          },
          onSuccess: (ctx) => {
            console.log(data);
            showToast("success", "Successfully signed in!");

            // redirect("/app/dashboard");
            //redirect to the dashboard or sign in page
          },
          onError: (ctx) => {
            // display the error message
            throw new Error(ctx.error.message);
          },
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        return showToast("error", error.message);
      }
    } finally {
      setIsIsLoading(false);
    }
  };

  const socialProviders = [
    {
      provider: "Google",
      icon: <FaGoogle />,
    },
    {
      provider: "Facebook",
      icon: <FaFacebook />,
    },
    {
      provider: "Github",
      icon: <FaGithub />,
    },
  ];

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 h-full gap-5 mx-5">
        <aside className="space-y-3 flex justify-center flex-col items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 flex justify-center flex-col items-center"
            >
              <article className="w-full sm:w-96">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="guest@shigotovault.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </article>

              <article className="w-full sm:w-96">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="*****" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </article>

              <article className="w-full sm:w-96 flex justify-center">
                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-[90%] h-12"
                >
                  <FaSpinner className={`${isLoading ? "animate-spin" : ""}`} />
                  Submit
                </Button>
              </article>

              <Separator className="data-[orientation=horizontal]:w-96 " />

              {socialProviders.map((item, index) => (
                <article key={index} className="flex justify-center">
                  <Button
                    type="button"
                    className="w-[250px] h-12 cursor-pointer"
                    variant="outline"
                  >
                    {item.icon}
                    Continue with {item.provider}
                  </Button>
                </article>
              ))}
            </form>
          </Form>
        </aside>
        <aside className="bg-black"></aside>
      </section>
    </>
  );
}
