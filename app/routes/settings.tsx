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
} from "@/components/ui/sidebar";
import { Link, Outlet } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ShieldAlert, User2Icon, UserRoundCogIcon } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings" },
    { name: "Settings", content: "Settings Page" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_EXPRESS };
}

export default function Settings({ loaderData }: Route.ComponentProps) {
  return (
    <div className="h-full mx-2 mt-2 space-y-2">
      <h1 className="font-secondary-header font-bold text-2xl text-center">
        Settings Page
      </h1>
      <h3 className="text-base font-sub-text text-center">
        You can modify anything related to your account here.
      </h3>

      <div className="flex gap-4 h-full">
        <SidebarGroup className="w-64 h-full border-r-1">
          <SidebarGroupLabel>Home</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === "/app/settings/profile"}
              className="data-[active=true]:bg-vault-purple"
            >
              <Link to="/app/settings/profile">
                <User2Icon />
                Profile
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === "/app/settings/account"}
              className="data-[active=true]:bg-vault-purple"
            >
              <Link to="/app/settings/account">
                <Shield />
                Account
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarGroup>

        {/* main content */}
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
