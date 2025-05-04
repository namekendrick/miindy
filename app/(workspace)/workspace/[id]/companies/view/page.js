import { redirect } from "next/navigation";

import { getViews } from "@/db/view";

export default async function CompaniesViewPage({ params }) {
  const { id } = await params;
  const views = await getViews(id, "COMPANY");

  if (views.length > 0)
    redirect(`/workspace/${id}/companies/view/${views[0].id}`);

  redirect(`/workspace/${id}/companies`);
}
