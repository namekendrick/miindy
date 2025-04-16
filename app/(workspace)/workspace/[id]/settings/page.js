import { redirect } from "next/navigation";

export default async function WorkspaceIdSettingsPage({ params }) {
  const { id } = await params;

  redirect(`/workspace/${id}/settings/profile`);
}
