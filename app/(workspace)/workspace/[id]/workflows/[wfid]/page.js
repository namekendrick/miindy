import { redirect } from "next/navigation";

export default async function WorkflowIdPage({ params }) {
  const { id, wfid } = await params;

  redirect(`/workspace/${id}/workflows/${wfid}/editor`);
}
