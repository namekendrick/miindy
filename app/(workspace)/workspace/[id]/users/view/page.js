import { redirect } from "next/navigation";

import { getViews } from "@/db/view";

export default async function UsersViewPage({ params }) {
  const { id } = await params;
  const views = await getViews(id, "USER");

  if (views.length > 0) redirect(`/workspace/${id}/users/view/${views[0].id}`);

  redirect(`/workspace/${id}/users`);
}
