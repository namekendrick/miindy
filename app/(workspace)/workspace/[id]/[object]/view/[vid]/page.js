import { redirect, notFound } from "next/navigation";

import { getObjectBySlug } from "@/db/objects";
import { getViews } from "@/db/view";
import { RecordsTable } from "@/features/records/components/records-table";

export default async function DynamicObjectViewRecordsPage({ params }) {
  const { id: workspaceId, object: slug, vid } = await params;

  const objectData = await getObjectBySlug(workspaceId, slug);

  if (!objectData) notFound();

  const views = await getViews(workspaceId, objectData.type);

  if (!views.some((view) => view.id === vid))
    redirect(`/workspace/${workspaceId}/${slug}/view`);

  return (
    <RecordsTable
      objectType={objectData.type}
      workspaceId={workspaceId}
      viewId={vid}
      views={views}
    />
  );
}
