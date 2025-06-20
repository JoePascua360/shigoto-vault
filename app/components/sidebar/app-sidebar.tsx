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
import { MdBusinessCenter, MdStackedBarChart } from "react-icons/md";
import { PiStepsDuotone } from "react-icons/pi";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { FaChartPie } from "react-icons/fa";

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
          icon: <BsFillInfoCircleFill />,
        },
      ],
    },
    {
      title: "Vault Section",
      url: "/",
      items: [
        {
          title: "Job Applications",
          url: "/job-applications",
          icon: <MdBusinessCenter />,
        },
        {
          title: "Company List",
          url: "/company-list",
          icon: <Building />,
        },
        {
          title: "Rounds List",
          url: "/rounds-list",
          icon: <PiStepsDuotone />,
        },
      ],
    },
    {
      title: "Charts Section",
      url: "#",
      items: [
        {
          title: "Application Insights",
          url: "/charts/job-applications",
          icon: <FaChartPie />,
        },
        {
          title: "Company Insights",
          url: "/charts/company",
          icon: <MdStackedBarChart />,
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
                defaultOpen={index >= 1}
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
                              <Link to={item.url}>
                                {item.icon}
                                {item.title}
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
