import { redirect } from "next/navigation";

import { getViews } from "@/db/view";

export default async function PeopleViewPage({ params }) {
  const { id } = await params;
  const views = await getViews(id, "PERSON");

  if (views.length > 0) redirect(`/workspace/${id}/people/view/${views[0].id}`);

  redirect(`/workspace/${id}/people`);
}
