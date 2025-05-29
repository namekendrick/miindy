import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/app/(workspace)/_components/appSidebar/app-sidebar";
import { NavigationTracker } from "@/app/(workspace)/_components/navigation-tracker";
import { SettingsSidebar } from "@/app/(workspace)/_components/settingsSidebar/settings-sidebar";
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
import { getCurrentUsersWorkspaces, getWorkspaceById } from "@/db/workspace";
import { currentUser } from "@/lib/auth";

export default async function WorkspaceLayout({ children }) {
  const user = await currentUser();
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  const workspaceId = pathname.split("/")[2];
  const isSettings = pathname.includes("/settings");
  const isWorkflowEditor =
    pathname.includes("/workflows/") && pathname.split("/").length > 4;
  const workspaces = await getCurrentUsersWorkspaces();
  const active = await getWorkspaceById(workspaceId);
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  if (pathname !== "/workspace") {
    const hasAccess = workspaces.some(
      (workspace) => workspace.id === workspaceId,
    );

    if (!hasAccess) redirect("/workspace");
  }

  if (isWorkflowEditor) return children;

  return (
    <SidebarProvider defaultOpen={isSettings ? true : defaultOpen}>
      {isSettings && <SettingsSidebar />}
      {!isSettings && (
        <AppSidebar user={user} workspaces={workspaces} active={active} />
      )}
      <SidebarInset>
        {!isSettings && workspaceId && (
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={`/workspace/${active.id}/home`}>
                      {active.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {pathname !== "/workspace" &&
                        (() => {
                          return (
                            pathname.split("/")[3]?.charAt(0).toUpperCase() +
                            pathname.split("/")[3]?.slice(1)
                          );
                        })()}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
        )}
        <NavigationTracker />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
