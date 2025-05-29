import { Editor } from "@/features/workflows/components/editor";

export default async function WorkflowEditorPage({ params }) {
  const { wfid, id } = await params;

  return <Editor workflowId={wfid} workspaceId={id} />;
}
