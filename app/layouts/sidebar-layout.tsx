import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, NavLink, Outlet } from "react-router";
import { ModeToggle } from "@/themes/mode-toggle";

export default function SidebarLayout() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 w-full">
            <aside className="flex items-center gap-3 flex-1">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                {/* Shows the current route of the user */}
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbSeparator className="hidden md:block" />

                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                          isActive ? "text-vault-purple" : ""
                        }
                      >
                        Dashboard
                      </NavLink>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbItem className="ml-auto"></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </aside>
            <aside>
              <ModeToggle />
            </aside>
          </header>
          {/* Main Content of the sidebar */}
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
