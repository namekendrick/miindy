import { redirect } from "next/navigation";

import { getViews } from "@/db/view";

export default async function DealsViewPage({ params }) {
  const { id } = await params;
  const views = await getViews(id, "DEAL");

  if (views.length > 0) redirect(`/workspace/${id}/deals/view/${views[0].id}`);

  redirect(`/workspace/${id}/deals`);
}
