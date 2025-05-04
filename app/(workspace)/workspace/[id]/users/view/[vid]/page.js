import { redirect } from "next/navigation";

import { getViews } from "@/db/view";
import { RecordsTable } from "@/features/records/components/records-table";

export default async function UsersRecords({ params }) {
  const { id, vid } = await params;
  const views = await getViews(id, "USER");

  if (!views.some((view) => view.id === vid))
    redirect(`/workspace/${id}/users/view`);

  return (
    <RecordsTable
      objectType="USER"
      workspaceId={id}
      viewId={vid}
      views={views}
    />
  );
}
