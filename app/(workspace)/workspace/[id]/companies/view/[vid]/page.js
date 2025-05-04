import { redirect } from "next/navigation";

import { getViews } from "@/db/view";
import { RecordsTable } from "@/features/records/components/records-table";

export default async function CompaniesRecords({ params }) {
  const { id, vid } = await params;
  const views = await getViews(id, "COMPANY");

  if (!views.some((view) => view.id === vid))
    redirect(`/workspace/${id}/companies/view`);

  return (
    <RecordsTable
      objectType="COMPANY"
      workspaceId={id}
      viewId={vid}
      views={views}
    />
  );
}
