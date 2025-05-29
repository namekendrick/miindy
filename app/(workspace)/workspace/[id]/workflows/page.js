import { WorkspaceWorkflows } from "@/features/workflows/components/workspace-workflows";

export default async function WorkflowsPage({ params }) {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <WorkspaceWorkflows workspaceId={id} />
    </div>
  );
}
