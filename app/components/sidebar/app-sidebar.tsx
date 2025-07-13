import * as React from "react";
import { Building, Minus, Plus } from "lucide-react";
import {
  Link,
  NavLink,
  useLocation,
  useMatch,
  useRouteError,
} from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter,
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { DatePicker } from "./date-picker";
import { authClient } from "@/config/auth-client";

import { MdSpaceDashboard } from "react-icons/md";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MdBusinessCenter, MdStackedBarChart } from "react-icons/md";
import { PiStepsDuotone } from "react-icons/pi";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { FaChartPie } from "react-icons/fa";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  const { data: session } = authClient.useSession();

  const data = {
    user: {
      name: session?.user.name || "Guest",
      email: session?.user?.isAnonymous
        ? "guest@shigotovault.com"
        : session?.user.email || "",
      avatar: "",
    },
    navMain: [
      {
        title: "Getting Started",
        url: "/",
        subItems: [
          {
            title: "Job Vault Tutorial 101",
            url: "/app/vault-tutorial",
            icon: <BsFillInfoCircleFill />,
          },
        ],
      },
      {
        title: "Vault Section",
        url: "/",
        subItems: [
          {
            title: "Job Applications",
            url: "/app/job-applications",
            icon: <MdBusinessCenter />,
          },
          {
            title: "Company List",
            url: "/app/company-list",
            icon: <Building />,
          },
          {
            title: "Rounds List",
            url: "/app/rounds-list",
            icon: <PiStepsDuotone />,
          },
        ],
      },
      {
        title: "Charts Section",
        url: "#",
        subItems: [
          {
            title: "Application Insights",
            url: "/app/charts/job-applications",
            icon: <FaChartPie />,
          },
          {
            title: "Company Insights",
            url: "/app/charts/company",
            icon: <MdStackedBarChart />,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        {/* Sidebar Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Home</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === "/app/dashboard"}
              className="data-[active=true]:bg-vault-purple"
            >
              <Link to="/app/dashboard">
                <MdSpaceDashboard />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((sidebarItem, index) => (
              <Collapsible
                key={sidebarItem.title}
                defaultOpen={index >= 1}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {sidebarItem.title}{" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {sidebarItem.subItems?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {sidebarItem.subItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className="data-[active=true]:bg-vault-purple"
                              isActive={location.pathname === subItem.url}
                            >
                              <Link to={subItem.url}>
                                {subItem.icon}
                                {subItem.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              {/* Add something here if a footer is needed */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
