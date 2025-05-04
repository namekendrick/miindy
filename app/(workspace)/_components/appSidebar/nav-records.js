"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const NavRecords = ({ items }) => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Records</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={pathname.includes(
                `/workspace/${workspaceId}/${item.url}`,
              )}
            >
              <Link href={`/workspace/${workspaceId}/${item.url}`}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
