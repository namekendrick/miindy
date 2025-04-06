import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

import { standardObjects } from "../constants/objects.js";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);

  // Create super admin and workspace
  const superAdmin = await prisma.user.create({
    data: {
      name: "Kendrick Johnson",
      email: "kendrick.d3.johnson@gmail.com",
      emailVerified: faker.date.past(),
      image: "https://github.com/shadcn.png",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isTwoFactorEnabled: false,
      workspaces: {
        create: {
          access: "SUPER_ADMIN",
          workspace: {
            create: {
              name: "Miindy",
              logo: "/images/owl.png",
              plan: "PRO",
            },
          },
        },
      },
    },
    include: {
      workspaces: true,
    },
  });

  console.log("Super admin created:", superAdmin);
  console.log("--------------------------------");
  console.log("Workspace created:", superAdmin.workspaces[0]);
  console.log("--------------------------------");

  // Create workspace users
  const generateWorkspaceUsers = async (num) => {
    for (let i = 0; i < num; i++) {
      let user = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: `kendrick.d3.johnson+${i + 1}@gmail.com`,
          emailVerified: faker.date.past(),
          image: faker.datatype.boolean(0.5) ? faker.image.avatar() : null,
          password: hashedPassword,
          role: "USER",
          isTwoFactorEnabled: true,
          workspaces: {
            create: {
              access: "USER",
              workspace: {
                connect: {
                  id: superAdmin.workspaces[0].workspaceId,
                },
              },
            },
          },
        },
      });

      console.log(`Workspace user #${i + 1} created:`, user);
      console.log("--------------------------------");
    }
  };

  await generateWorkspaceUsers(5);

  // Create standard objects
  const generateStandardObjects = async () => {
    const workspace = await prisma.workspace.update({
      where: {
        id: superAdmin.workspaces[0].workspaceId,
      },
      data: {
        objects: {
          create: standardObjects(superAdmin.workspaces[0].workspaceId),
        },
      },
      include: {
        objects: {
          include: {
            attributes: true,
          },
        },
      },
    });

    console.log("Standard objects created:", workspace.objects);
    console.log("--------------------------------");

    return workspace.objects;
  };

  const objects = await generateStandardObjects();

  const industries = [
    "Technology",
    "Manufacturing",
    "Healthcare",
    "Finance",
    "Retail",
  ];

  const dealStages = [
    "Qualified",
    "Meeting Scheduled",
    "Proposal",
    "Negotiation",
    "Closed Won",
    "Closed Lost",
  ];

  const companies = await Promise.all(
    Array(8)
      .fill(null)
      .map((_, index) => {
        return prisma.record.create({
          data: {
            objectId: objects[1].id,
            workspaceId: superAdmin.workspaces[0].workspaceId,
            ownerId: superAdmin.id,
            values: {
              create: [
                {
                  attributeId: objects[1].attributes[0].id,
                  value: { value: faker.company.name() },
                },
                {
                  attributeId: objects[1].attributes[1].id,
                  value: { value: industries[index % industries.length] },
                },
                ...(faker.datatype.boolean(0.5)
                  ? [
                      {
                        attributeId: objects[1].attributes[2].id,
                        value: {
                          value: Math.floor(Math.random() * 1000),
                        },
                      },
                    ]
                  : []),
                {
                  attributeId: objects[1].attributes[3].id,
                  value: {
                    value: Math.floor(Math.random() * 10000000),
                  },
                },
                {
                  attributeId: objects[1].attributes[4].id,
                  value: {
                    value: faker.internet.url(),
                  },
                },
                ...(faker.datatype.boolean(0.1)
                  ? [
                      {
                        attributeId: objects[1].attributes[5].id,
                        value: {
                          value: "opted-out",
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          include: {
            values: true,
          },
        });
      }),
  );

  console.log("Companies created:", companies);
  console.log("--------------------------------");

  const people = await Promise.all(
    Array(12)
      .fill(null)
      .map(() => {
        return prisma.record.create({
          data: {
            objectId: objects[0].id,
            workspaceId: superAdmin.workspaces[0].workspaceId,
            ownerId: superAdmin.id,
            values: {
              create: [
                {
                  attributeId: objects[0].attributes[0].id,
                  value: { value: faker.person.fullName() },
                },
                {
                  attributeId: objects[0].attributes[1].id,
                  value: { value: faker.internet.email() },
                },
                ...(faker.datatype.boolean(0.5)
                  ? [
                      {
                        attributeId: objects[0].attributes[2].id,
                        value: {
                          value: `+1${Math.floor(Math.random() * 10000000000)}`,
                        },
                      },
                    ]
                  : []),
                {
                  attributeId: objects[0].attributes[3].id,
                  value: {
                    value: faker.person.jobTitle(),
                  },
                },
                {
                  attributeId: objects[0].attributes[4].id,
                  value: {
                    value: Math.floor(Math.random() * 100),
                  },
                },
                {
                  attributeId: objects[0].attributes[5].id,
                  value: {
                    value:
                      companies[Math.floor(Math.random() * companies.length)]
                        .id,
                  },
                },
              ],
            },
          },
          include: {
            values: true,
          },
        });
      }),
  );

  console.log("People created:", people);
  console.log("--------------------------------");

  const deals = await Promise.all(
    Array(7)
      .fill(null)
      .map((_, index) => {
        return prisma.record.create({
          data: {
            objectId: objects[2].id,
            workspaceId: superAdmin.workspaces[0].workspaceId,
            ownerId: superAdmin.id,
            values: {
              create: [
                {
                  attributeId: objects[2].attributes[0].id,
                  value: { value: faker.lorem.words(5) },
                },
                {
                  attributeId: objects[2].attributes[1].id,
                  value: { value: faker.finance.amount() },
                },
                {
                  attributeId: objects[2].attributes[2].id,
                  value: {
                    value: dealStages[index % dealStages.length],
                  },
                },
                ...(faker.datatype.boolean(0.5)
                  ? [
                      {
                        attributeId: objects[2].attributes[3].id,
                        value: {
                          value: faker.date.future(),
                        },
                      },
                    ]
                  : []),
                {
                  attributeId: objects[2].attributes[4].id,
                  value: {
                    value: Math.floor(Math.random() * 100),
                  },
                },
              ],
            },
          },
          include: {
            values: true,
          },
        });
      }),
  );

  console.log("Deals created:", deals);
  console.log("--------------------------------");

  // const users = await Promise.all(
  //   Array(10)
  //     .fill(null)
  //     .map(() => {
  //       return prisma.record.create({
  //         data: {
  //           objectId: objects[3].id,
  //           workspaceId: superAdmin.workspaces[0].workspaceId,
  //           ownerId: superAdmin.id,
  //           values: {
  //             create: [
  //               {
  //                 attributeId: objects[3].attributes[0].id,
  //                 value: { value: faker.person.fullName() },
  //               },
  //               {
  //                 attributeId: objects[3].attributes[1].id,
  //                 value: { value: faker.internet.email() },
  //               },
  //             ],
  //           },
  //         },
  //         include: {
  //           values: true,
  //         },
  //       });
  //     }),
  // );

  // console.log("Users created:", users);
  // console.log("--------------------------------");

  // const workspaces = await Promise.all(
  //   Array(10)
  //     .fill(null)
  //     .map(() => {
  //       return prisma.record.create({
  //         data: {
  //           objectId: objects[4].id,
  //           workspaceId: superAdmin.workspaces[0].workspaceId,
  //           ownerId: superAdmin.id,
  //           values: {
  //             create: [
  //               {
  //                 attributeId: objects[4].attributes[0].id,
  //                 value: { value: faker.word.noun() },
  //               },
  //               {
  //                 attributeId: objects[4].attributes[1].id,
  //                 value: { value: faker.image.url() },
  //               },
  //             ],
  //           },
  //         },
  //         include: {
  //           values: true,
  //         },
  //       });
  //     }),
  // );

  // console.log("Workspaces created:", workspaces);
  // console.log("--------------------------------");

  const relatedRecords = await Promise.all(
    people
      .map(async (person) => {
        const companyValue = person.values.find(
          (v) => v.attributeId === objects[0].attributes[5].id,
        );

        if (companyValue) {
          return prisma.relatedRecord.create({
            data: {
              attributeId: objects[0].attributes[5].id,
              fromRecordId: person.id,
              toRecordId: companyValue.value.value,
            },
          });
        }
      })
      .filter(Boolean),
  );

  console.log("Related records created:", relatedRecords);
  console.log("--------------------------------");

  const lists = await Promise.all([
    prisma.list.create({
      data: {
        objectId: objects[1].id,
        name: "High-Value Companies",
        description: "Companies with revenue over $5M",
        records: {
          createMany: {
            data: companies
              .filter((company) => {
                const revenueValue = company.values.find(
                  (v) => v.attributeId === objects[1].attributes[3].id,
                )?.value.value;
                return revenueValue >= 5000000;
              })
              .map((company) => ({
                recordId: company.id,
              })),
          },
        },
        attributes: {
          createMany: {
            data: [
              { attributeId: objects[1].attributes[0].id },
              { attributeId: objects[1].attributes[2].id },
              { attributeId: objects[1].attributes[3].id },
            ],
          },
        },
      },
    }),
    prisma.list.create({
      data: {
        objectId: objects[0].id,
        name: "Key Decision Makers",
        description: "Important contacts",
        records: {
          createMany: {
            data: people
              .filter((person) => {
                const titleValue = person.values.find(
                  (v) => v.attributeId === objects[0].attributes[3].id,
                )?.value.value;
                return (
                  titleValue?.includes("Senior") ||
                  titleValue?.includes("Chief")
                );
              })
              .map((person) => ({
                recordId: person.id,
              })),
          },
        },
        attributes: {
          createMany: {
            data: [
              { attributeId: objects[0].attributes[0].id },
              { attributeId: objects[0].attributes[1].id },
              { attributeId: objects[0].attributes[3].id },
            ],
          },
        },
      },
    }),
    prisma.list.create({
      data: {
        objectId: objects[2].id,
        name: "Hot Deals",
        description: "Deals likely to close this quarter",
        records: {
          createMany: {
            data: deals
              .filter((deal) => {
                const probability = deal.values.find(
                  (v) => v.attributeId === objects[2].attributes[4].id,
                )?.value.value;
                return probability >= 70;
              })
              .map((deal) => ({
                recordId: deal.id,
              })),
          },
        },
        attributes: {
          createMany: {
            data: [
              { attributeId: objects[2].attributes[0].id },
              { attributeId: objects[2].attributes[4].id },
            ],
          },
        },
      },
    }),
  ]);

  console.log("Lists created:", lists);
  console.log("--------------------------------");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
