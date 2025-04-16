"use client";

import { NavMain } from "@/app/(workspace)/_components/appSidebar/nav-main";
import { NavRecords } from "@/app/(workspace)/_components/appSidebar/nav-records";
import { NavUser } from "@/app/(workspace)/_components/appSidebar/nav-user";
import { TeamSwitcher } from "@/app/(workspace)/_components/appSidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { navMain, navRecords } from "@/constants/menus";

export const AppSidebar = ({ user, workspaces, active }) => {
  return (
    <>
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
          <TeamSwitcher teams={workspaces} active={active} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navMain} />
          <NavRecords items={navRecords} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
};
