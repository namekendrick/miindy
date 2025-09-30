import { redirect, notFound } from "next/navigation";

import { getObjectBySlug } from "@/db/objects";
import { getViews } from "@/db/view";

export default async function DynamicObjectViewPage({ params }) {
  const { id: workspaceId, object: slug } = await params;

  const objectData = await getObjectBySlug(workspaceId, slug);

  if (!objectData) notFound();

  const views = await getViews(workspaceId, objectData.type);

  if (views.length > 0)
    redirect(`/workspace/${workspaceId}/${slug}/view/${views[0].id}`);

  redirect(`/workspace/${workspaceId}/${slug}`);
}
