"use client";

import { Archive, Bolt, Copy, MoreHorizontal } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

import { Breadcrumb } from "@/app/(workspace)/workspace/[id]/settings/_components/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArchiveAttribute } from "@/features/attributes/api/use-archive-attribute";
import { useUpdateAttributeModal } from "@/features/attributes/hooks/use-update-attribute-modal";
import { useGetObjects } from "@/features/objects/api/use-get-objects";
import { ObjectConfigForm } from "@/features/objects/components/object-config-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export default function ObjectSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const slug = params.slug[0];
  const defaultTab = params.slug[1] || "general";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const openUpdateAttributeModal = useUpdateAttributeModal(
    (state) => state.onOpen,
  );

  const { data: objects, isLoading } = useGetObjects(workspaceId);

  const { mutate: archiveAttribute } = useArchiveAttribute();

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    router.push(`/workspace/${workspaceId}/settings/objects/${slug}/${value}`);
  };

  if (isLoading)
    return (
      <div className="mt-10 flex items-center justify-center gap-2">
        <ClipLoader size={20} /> Loading
      </div>
    );

  const object = objects?.find((obj) => obj.slug === slug);
  if (!object) return <div>Object not found</div>;

  const archivedAttributes =
    object.attributes?.filter((attribute) => attribute.isArchived) || [];

  return (
    <div className="space-y-6">
      <Breadcrumb
        parentRoute="objects"
        parentLabel="Objects"
        currentLabel={object.singular}
      />
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general">Configuration</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-6 pt-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-medium">General</h2>
            <p className="text-xs text-muted-foreground">
              Configure general settings for {object.singular}
            </p>
          </div>
          <ObjectConfigForm object={object} />
        </TabsContent>
        <TabsContent value="attributes" className="space-y-6 pt-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-medium">Attributes</h2>
            <p className="text-xs text-muted-foreground">
              Manage attributes for {object.singular}
            </p>
          </div>
          {object.attributes && (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="w-1/3 py-2 pl-4 text-left text-sm font-medium">
                      Name
                    </th>
                    <th className="w-1/4 py-2 text-left text-sm font-medium">
                      Type
                    </th>
                    <th className="w-1/3 py-2 pr-4 text-left text-sm font-medium">
                      Properties
                    </th>
                    <th className="w-[80px] py-2 pr-4 text-left text-sm font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {object.attributes
                    .filter((attribute) => !attribute.isArchived)
                    .map((attribute) => (
                      <tr
                        key={attribute.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-2 pl-4 text-sm">{attribute.name}</td>
                        <td className="py-2 text-sm">
                          {attribute.attributeType
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase(),
                            )
                            .join(" ")}
                        </td>
                        <td className="space-x-2 py-2 pr-4 text-sm">
                          {attribute.isSystem && (
                            <Badge className="bg-muted text-xs font-medium text-primary hover:bg-muted">
                              System
                            </Badge>
                          )}
                          {attribute.isEnriched && (
                            <Badge className="border-[0.5px] border-sky-800 bg-sky-50 text-xs font-medium text-sky-800 hover:bg-sky-50">
                              Enriched
                            </Badge>
                          )}
                        </td>
                        <td className="py-2 pr-4 text-right">
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!attribute.isSystem && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    openUpdateAttributeModal({ attribute })
                                  }
                                >
                                  <Bolt className="h-4 w-4" /> Edit attribute
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => {
                                  navigator.clipboard.writeText(attribute.id);
                                }}
                              >
                                <Copy className="h-4 w-4" /> Copy ID
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  navigator.clipboard.writeText(attribute.slug);
                                }}
                              >
                                <Copy className="h-4 w-4" /> Copy slug
                              </DropdownMenuItem>
                              {!attribute.isSystem && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => {
                                      archiveAttribute({ attribute });
                                    }}
                                  >
                                    <Archive className="h-4 w-4" /> Archive
                                    attribute
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  {archivedAttributes.length > 0 && (
                    <tr>
                      <td colSpan={4}>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem
                            value="archived-attributes"
                            className="border-none"
                          >
                            <AccordionTrigger className="px-4 py-4">
                              Archived ({archivedAttributes.length})
                            </AccordionTrigger>
                            <AccordionContent className="pb-0">
                              <table className="w-full">
                                <tbody>
                                  {archivedAttributes.map((attribute) => (
                                    <tr
                                      key={attribute.id}
                                      className="border-b text-muted-foreground last:border-none hover:bg-muted/50"
                                    >
                                      <td className="w-1/3 py-2 pl-4 text-sm">
                                        {attribute.name}
                                      </td>
                                      <td className="w-1/4 py-2 text-sm">
                                        {attribute.attributeType
                                          .split("_")
                                          .map(
                                            (word) =>
                                              word.charAt(0).toUpperCase() +
                                              word.slice(1).toLowerCase(),
                                          )
                                          .join(" ")}
                                      </td>
                                      <td className="w-1/3 space-x-2 py-2 pr-4 text-sm">
                                        {attribute.isSystem && (
                                          <Badge className="bg-muted text-xs font-medium text-muted-foreground hover:bg-muted">
                                            System
                                          </Badge>
                                        )}
                                        {attribute.isEnriched && (
                                          <Badge className="border-[0.5px] border-sky-800/40 bg-sky-50/50 text-xs font-medium text-sky-800/60 hover:bg-sky-50/50">
                                            Enriched
                                          </Badge>
                                        )}
                                      </td>
                                      <td className="w-[80px] py-2 pr-4 text-right">
                                        <DropdownMenu modal={false}>
                                          <DropdownMenuTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              className="h-8 w-8 p-0"
                                            >
                                              <span className="sr-only">
                                                Open menu
                                              </span>
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                              onClick={() => {
                                                navigator.clipboard.writeText(
                                                  attribute.id,
                                                );
                                              }}
                                            >
                                              <Copy className="h-4 w-4" /> Copy
                                              ID
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() => {
                                                navigator.clipboard.writeText(
                                                  attribute.slug,
                                                );
                                              }}
                                            >
                                              <Copy className="h-4 w-4" /> Copy
                                              slug
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                              onClick={() => {
                                                archiveAttribute({
                                                  attribute,
                                                  restore: true,
                                                });
                                              }}
                                            >
                                              <Archive className="h-4 w-4" />{" "}
                                              Restore attribute
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
