import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { NavLink, useMatch } from "react-router";
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
  SidebarRail,
  SidebarFooter,
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { DatePicker } from "./date-picker";

import { MdSpaceDashboard } from "react-icons/md";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const data = {
  user: {
    name: "Guest",
    email: "guest@shigotovault.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Getting Started",
      url: "/",
      items: [
        {
          title: "Job Vault Tutorial 101",
          url: "/vault-tutorial",
        },
      ],
    },
    {
      title: "Vault Section",
      url: "#",
      items: [
        {
          title: "Job Applications",
          url: "/job-applications",
        },
        {
          title: "Company List",
          url: "#",
        },
        {
          title: "Rounds List",
          url: "#",
        },
      ],
    },
    {
      title: "Charts Section",
      url: "#",
      items: [
        {
          title: "Job Application Insights",
          url: "#",
        },
        {
          title: "Company Insights",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const match = useMatch("/dashboard");

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
              isActive={!!match}
              className="dark:data-[active=true]:bg-vault-purple data-[active=true]:bg-vault-purple"
            >
              <NavLink to="/dashboard">
                <MdSpaceDashboard />
                Dashboard
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 1}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.title}{" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              // isActive={item.isActive}
                            >
                              <a href={item.url}>{item.title}</a>
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
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
