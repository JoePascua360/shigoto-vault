import { ModeToggle } from "@/themes/mode-toggle";
import { LogIn, User2, UserRoundPen, Vault } from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { useDialog } from "@/hooks/use-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/config/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { showToast } from "@/utils/show-toast";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Button } from "../ui/button";
import DynamicDialog from "../dynamic-dialog";
import { Input } from "../ui/input";
import { DialogClose } from "../ui/dialog";

interface NavbarRightSectionProps {}

const formSchema = z.object({
  email: z.email().min(1, "Email is required!"),
  password: z.string().min(8, "Must be 8 characters minimum!"),
});

export default function NavbarRightSection({}: NavbarRightSectionProps) {
  const signInDialog = useDialog();

  const { data: session } = authClient.useSession();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (value: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await authClient.signIn.email(value, {
        onSuccess: async (ctx) => {
          console.log(ctx.data);
          showToast("success", "Successfully logged in!");
        },

        onError: async (ctx) => {
          throw new Error(ctx.error.message);
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        return showToast("error", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center gap-2">
      <>
        {session?.user && !session?.user.isAnonymous ? (
          <Button variant="secondary" size="lg" className="text-sm">
            <User2 />
            Hello, {session?.user.email}
          </Button>
        ) : (
          <DynamicDialog
            dialog={signInDialog}
            title="Account Sign In"
            description="Log in to your account to access more features!"
            triggerElement={
              <Button
                variant="secondary"
                size="lg"
                className="text-sm cursor-pointer"
              >
                Sign In
              </Button>
            }
          >
            <main>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="grid gap-3 mt-3 font-sub-text"
                >
                  <aside>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="guest@shigotovault.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </aside>

                  <aside>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="*******"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </aside>

                  <aside className="flex justify-center">
                    <Button
                      size="lg"
                      disabled={isLoading}
                      className="text-base cursor-pointer w-44 h-12 font-content"
                    >
                      {isLoading && (
                        <FaSpinner
                          className={`${isLoading ? "animate-spin" : ""}`}
                        />
                      )}
                      Sign In
                    </Button>
                  </aside>
                </form>
              </Form>

              <footer className="mt-5">
                Don't have an account yet? Create one{" "}
                <DialogClose asChild>
                  <Link to="/signup" className="underline text-vault-purple">
                    here
                  </Link>
                </DialogClose>
                .
              </footer>
            </main>
          </DynamicDialog>
        )}
      </>

      <ModeToggle />
    </section>
  );
}
