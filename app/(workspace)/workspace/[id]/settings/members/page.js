"use client";

import { ClipLoader } from "react-spinners";

import { MembersTable } from "@/features/members/components/members-table";
import { InviteMemberCard } from "@/features/members/components/invite-member-card";
import { useMembersSettings } from "@/features/members/hooks/use-members-settings";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export default function MembersSettingsPage() {
  const workspaceId = useWorkspaceId();

  const {
    inviteForm,
    onSubmitInviteForm,
    isInvitingMember,
    membersTable,
    isLoadingMembers,
  } = useMembersSettings(workspaceId);

  if (isLoadingMembers)
    return (
      <div className="mt-40 flex items-center justify-center gap-2">
        <ClipLoader size={20} /> Loading
      </div>
    );

  return (
    <>
      <InviteMemberCard
        form={inviteForm}
        onSubmit={onSubmitInviteForm}
        isInvitingMember={isInvitingMember}
      />
      <MembersTable table={membersTable} />
    </>
  );
}
