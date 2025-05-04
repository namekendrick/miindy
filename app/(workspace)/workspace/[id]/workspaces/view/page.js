import { redirect } from "next/navigation";

import { getViews } from "@/db/view";

export default async function WorkspacesViewPage({ params }) {
  const { id } = await params;
  const views = await getViews(id, "WORKSPACE");

  if (views.length > 0)
    redirect(`/workspace/${id}/workspaces/view/${views[0].id}`);

  redirect(`/workspace/${id}/workspaces`);
}
