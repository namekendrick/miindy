"use client";

import { ChevronLeft } from "lucide-react";

import { AccountSettings } from "@/app/(workspace)/_components/settingsSidebar/account-settings";
import { DataSettings } from "@/app/(workspace)/_components/settingsSidebar/data-settings";
import { WorkspaceSettings } from "@/app/(workspace)/_components/settingsSidebar/workspace-settings";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  accountSettings,
  workspaceSettings,
  dataSettings,
} from "@/constants/menus";
import { useHandleBack } from "@/hooks/use-handle-back";

export const SettingsSidebar = () => {
  const handleBack = useHandleBack();

  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button onClick={handleBack} variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold">Settings</div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <AccountSettings items={accountSettings} />
        <WorkspaceSettings items={workspaceSettings} />
        <DataSettings items={dataSettings} />
      </SidebarContent>
    </Sidebar>
  );
};
