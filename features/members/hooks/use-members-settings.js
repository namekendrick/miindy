"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { MEMBERS_PER_PAGE } from "@/constants/pagination";
import { magicLinkSchema } from "@/features/auth/schemas";
import { useGetWorkspaceMembers } from "@/features/members/api/use-get-members";
import { useInviteMember } from "@/features/members/api/use-invite-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { memberColumns } from "@/features/members/components/columns";

export const useMembersSettings = (workspaceId) => {
  const queryClient = useQueryClient();

  // FOR INVITE MEMBER CARD
  const { mutate: inviteMember, isPending: isInvitingMember } =
    useInviteMember();

  const inviteForm = useForm({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmitInviteForm = (values) => {
    values.workspaceId = workspaceId;

    inviteMember(values);
  };

  // FOR MEMBERS TABLE
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pagesize: MEMBERS_PER_PAGE,
  });

  const { data, isLoading: isLoadingMembers } = useGetWorkspaceMembers(
    workspaceId,
    pagination.pageIndex + 1,
  );

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();

  // useEffect(() => {
  //   if (!isLoadingMembers) {
  //     queryClient.invalidateQueries({
  //       queryKey: ["members", workspaceId, pagination.pageIndex + 1],
  //     });
  //   }
  // }, [isLoadingMembers, pagination]);

  const membersTable = useReactTable({
    columns: memberColumns(),
    manualPagination: true,
    data: data?.paginated,
    pageCount: data?.totalPages,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return {
    inviteForm,
    onSubmitInviteForm,
    isInvitingMember,
    membersTable,
    isLoadingMembers,
    updateMember,
    isUpdatingMember,
  };
};
