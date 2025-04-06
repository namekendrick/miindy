export const standardObjects = (workspaceId) => [
  {
    singular: "Person",
    plural: "People",
    slug: "people",
    type: "PERSON",
    isStandard: true,
    attributes: {
      create: [
        {
          name: "Full Name",
          attributeType: "TEXT",
          isSystem: true,
          workspaceId,
        },
        { name: "Email", attributeType: "TEXT", isSystem: true, workspaceId },
        { name: "Phone", attributeType: "PHONE", isSystem: true, workspaceId },
        { name: "Title", attributeType: "TEXT", isSystem: true, workspaceId },
        {
          name: "Lead Score",
          attributeType: "RATING",
          isSystem: true,
          workspaceId,
        },
        {
          name: "Company",
          attributeType: "RELATIONSHIP",
          relationshipType: "MANY_TO_ONE",
          isSystem: true,
          workspaceId,
        },
      ],
    },
  },
  {
    singular: "Company",
    plural: "Companies",
    slug: "companies",
    type: "COMPANY",
    isStandard: true,
    attributes: {
      create: [
        { name: "Name", attributeType: "TEXT", isSystem: true, workspaceId },
        {
          name: "Industry",
          attributeType: "SELECT",
          isSystem: true,
          workspaceId,
        },
        { name: "Size", attributeType: "SELECT", isSystem: true, workspaceId },
        {
          name: "Revenue",
          attributeType: "CURRENCY",
          isSystem: true,
          workspaceId,
        },
        { name: "Website", attributeType: "TEXT", isSystem: true, workspaceId },
        {
          name: "Status",
          attributeType: "STATUS",
          isSystem: true,
          workspaceId,
        },
      ],
    },
  },
  {
    singular: "Deal",
    plural: "Deals",
    slug: "deals",
    type: "DEAL",
    isStandard: true,
    attributes: {
      create: [
        { name: "Name", attributeType: "TEXT", isSystem: true, workspaceId },
        {
          name: "Value",
          attributeType: "CURRENCY",
          isSystem: true,
          workspaceId,
        },
        { name: "Stage", attributeType: "STATUS", isSystem: true, workspaceId },
        {
          name: "Close Date",
          attributeType: "DATE",
          isSystem: true,
          workspaceId,
        },
        {
          name: "Probability",
          attributeType: "NUMBER",
          isSystem: true,
          workspaceId,
        },
      ],
    },
  },
  {
    singular: "User",
    plural: "Users",
    slug: "users",
    type: "USER",
    isStandard: true,
    attributes: {
      create: [
        { name: "Name", attributeType: "TEXT", isSystem: true, workspaceId },
        { name: "Email", attributeType: "TEXT", isSystem: true, workspaceId },
      ],
    },
  },
  {
    singular: "Workspace",
    plural: "Workspaces",
    slug: "workspaces",
    type: "WORKSPACE",
    isStandard: true,
    attributes: {
      create: [
        { name: "Name", attributeType: "TEXT", isSystem: true, workspaceId },
        { name: "Logo", attributeType: "TEXT", isSystem: true, workspaceId },
      ],
    },
  },
];
