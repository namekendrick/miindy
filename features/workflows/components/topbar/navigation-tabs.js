"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const NavigationTabs = ({ workflowId, workspaceId }) => {
  const pathname = usePathname();
  const activeValue = pathname?.split("/")[5];

  return (
    <Tabs value={activeValue} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <Link href={`/workspace/${workspaceId}/workflows/${workflowId}/editor`}>
          <TabsTrigger value="editor" className="w-full">
            Editor
          </TabsTrigger>
        </Link>
        <Link href={`/workspace/${workspaceId}/workflows/${workflowId}/runs`}>
          <TabsTrigger value="runs" className="w-full">
            Runs
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
};
