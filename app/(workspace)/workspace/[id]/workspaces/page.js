import { redirect } from "next/navigation";

import { getViews } from "@/db/view";
import { NoViewsFound } from "@/features/records/components/no-views-found";

export default async function WorkspacesPage({ params }) {
  const { id } = await params;
  const views = await getViews(id, "WORKSPACE");

  if (views.length > 0)
    redirect(`/workspace/${id}/workspaces/view/${views[0].id}`);

  return <NoViewsFound id={id} objectType="WORKSPACE" />;
}
