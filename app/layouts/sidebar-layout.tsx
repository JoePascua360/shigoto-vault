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
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { ModeToggle } from "@/themes/mode-toggle";
import { formatPathName } from "@/utils/format-pathname";

/**
 * Contains the list of valid routes defined in [routes.ts](../../routes.ts).
 *
 * For invalid paths, it will get 404 error page.
 */
const validPaths: string[] = [
  "/dashboard",
  // "/vault-tutorial",
  "/job-applications",
  // "/company-list",
  // "/charts/job-applications",
  // "/charts/company",
];

export default function SidebarLayout() {
  const location = useLocation();

  const isValidPath = validPaths.includes(location.pathname);

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
                    <Link to="/">Home</Link>
                  </BreadcrumbItem>

                  <BreadcrumbSeparator />

                  <BreadcrumbItem>
                    <NavLink
                      to={location.pathname}
                      className={({ isActive }) =>
                        isActive ? "text-vault-purple" : ""
                      }
                    >
                      {isValidPath ? (
                        <p className="capitalize">
                          {formatPathName(location.pathname)}
                        </p>
                      ) : (
                        "Not Found"
                      )}
                    </NavLink>
                  </BreadcrumbItem>
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
