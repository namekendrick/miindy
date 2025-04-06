import { redirect } from "next/navigation";

import { getViews } from "@/db/view";
import { RecordsTable } from "@/features/records/components/records-table";

export default async function PeopleRecords({ params }) {
  const { id, vid } = await params;
  const views = await getViews(id, "PERSON");

  if (!views.some((view) => view.id === vid))
    redirect(`/workspace/${id}/people/view`);

  return (
    <RecordsTable
      objectType="PERSON"
      workspaceId={id}
      viewId={vid}
      views={views}
    />
  );
}
