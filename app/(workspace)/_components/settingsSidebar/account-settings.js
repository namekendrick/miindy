"use client";

import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { isSettingsItemActive } from "@/lib/utils";

export const AccountSettings = ({ items }) => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Account</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={isSettingsItemActive(item.url, pathname)}
            >
              <a href={`/workspace/${workspaceId}/${item.url}`}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
