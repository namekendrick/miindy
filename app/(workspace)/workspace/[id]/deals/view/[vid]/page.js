import { redirect } from "next/navigation";

import { getViews } from "@/db/view";
import { RecordsTable } from "@/features/records/components/records-table";

export default async function DealsRecords({ params }) {
  const { id, vid } = await params;
  const views = await getViews(id, "DEAL");

  if (!views.some((view) => view.id === vid))
    redirect(`/workspace/${id}/deals/view`);

  return (
    <RecordsTable
      objectType="DEAL"
      workspaceId={id}
      viewId={vid}
      views={views}
    />
  );
}
