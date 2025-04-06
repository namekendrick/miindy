export const columns = () => {
  return [
    {
      accessorKey: "plural",
      label: "Object",
      header: () => {
        return "Objects";
      },
      cell: ({ row }) => {
        return (
          <div className="overflow-hidden text-ellipsis font-medium">
            {row.original.plural}
          </div>
        );
      },
    },
    {
      accessorKey: "isStandard",
      label: "Type",
      header: () => {
        return "Type";
      },
      cell: ({ row }) => {
        return (
          <div className="overflow-hidden text-ellipsis">
            {row.original.isStandard ? "Standard" : "Custom"}
          </div>
        );
      },
    },
    {
      accessorKey: "_count",
      label: "Records",
      header: () => {
        return "Records";
      },
      cell: ({ row }) => {
        return (
          <div className="overflow-hidden text-ellipsis">
            {row.original._count.records >= 1
              ? row.original._count.records
              : "No records"}
          </div>
        );
      },
    },
  ];
};
