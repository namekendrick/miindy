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
import { Skeleton } from "@/components/ui/skeleton";
import { useGetObjectNavigation } from "@/features/objects/api/use-get-object-navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const NavRecords = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const { data: items = [], isLoading } = useGetObjectNavigation(workspaceId);

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Records</SidebarGroupLabel>
        <SidebarMenu>
          {Array.from({ length: 5 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <div className="flex items-center space-x-2 px-2 py-1">
                <Skeleton className="h-6 w-4 rounded" />
                <Skeleton className="h-6 flex-1" />
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Records</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.slug}>
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
