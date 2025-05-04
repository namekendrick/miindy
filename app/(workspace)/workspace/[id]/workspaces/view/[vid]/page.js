import { redirect } from "next/navigation";

import { getViews } from "@/db/view";
import { RecordsTable } from "@/features/records/components/records-table";

export default async function WorkspacesRecords({ params }) {
  const { id, vid } = await params;
  const views = await getViews(id, "WORKSPACE");

  if (!views.some((view) => view.id === vid))
    redirect(`/workspace/${id}/workspaces/view`);

  return (
    <RecordsTable
      objectType="WORKSPACE"
      workspaceId={id}
      viewId={vid}
      views={views}
    />
  );
}
