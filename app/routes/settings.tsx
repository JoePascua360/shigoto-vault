import { MdSpaceDashboard } from "react-icons/md";
import type { Route } from "./+types/settings";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Link, Outlet } from "react-router";
import {
  SettingsIcon,
  Shield,
  ShieldAlert,
  User2Icon,
  UserRoundCogIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_EXPRESS };
}

const sidebarItems = [
  {
    title: "Profile",
    icon: <User2Icon />,
  },
  {
    title: "Account",
    icon: <Shield />,
  },
];

export default function Settings({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <title>Settings | Shigoto Vault</title>
      <meta property="og:title" content="Settings | Shigoto Vault" />
      <meta name="description" content="Settings for managing user account" />

      <aside className="mx-3 space-y-5 my-2">
        <div className="ml-4 space-y-1">
          <h1 className="font-secondary-header font-bold text-2xl">Settings</h1>
          <h3 className="text-base font-sub-text">
            You can modify anything related to your account here.
          </h3>
        </div>

        <div className="flex gap-2">
          <SidebarProvider
            name="settings-nav"
            className="w-[calc(var(--sidebar-width-icon)+5px)]! min-h-full"
          >
            <Sidebar
              collapsible="none"
              className="w-[calc(var(--sidebar-width-icon)+5px)]! bg-transparent border-1 rounded-lg"
            >
              <SidebarHeader>
                <Button>
                  <SettingsIcon />
                </Button>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarMenu>
                    {sidebarItems.map((item, index) =>
                      item.title === "Profile" ? (
                        <SidebarMenuButton
                          key={item.title}
                          asChild
                          isActive={location.pathname === `/app/settings`}
                          className="data-[active=true]:bg-vault-purple flex justify-center"
                          tooltip={{
                            children: item.title,
                            hidden: false,
                          }}
                        >
                          <Link to={`/app/settings`}>{item.icon}</Link>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          key={item.title}
                          asChild
                          isActive={
                            location.pathname ===
                            `/app/settings/${item.title.toLowerCase()}`
                          }
                          className="data-[active=true]:bg-vault-purple flex justify-center"
                          tooltip={{
                            children: item.title,
                            hidden: false,
                          }}
                        >
                          <Link
                            to={`/app/settings/${item.title.toLowerCase()}`}
                          >
                            {item.icon}
                          </Link>
                        </SidebarMenuButton>
                      )
                    )}
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </SidebarProvider>

          {/* main content */}
          <main className="w-full">
            <Outlet />
          </main>
        </div>
      </aside>
    </>
  );
}
