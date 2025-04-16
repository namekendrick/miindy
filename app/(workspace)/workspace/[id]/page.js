import { redirect } from "next/navigation";

export default async function WorkspaceIdPage({ params }) {
  const { id } = await params;

  redirect(`/workspace/${id}/home`);
}
