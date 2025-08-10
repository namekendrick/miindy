"use server";

import prisma from "@/lib/prisma";
import { getCurrentUsersWorkspaces } from "@/db/workspace";
import { currentUser } from "@/lib/auth";

export async function syncHubSpotContactsToPersonRecords(hubspotContacts) {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get all workspaces for the current user
    const workspaces = await getCurrentUsersWorkspaces();
    if (!workspaces || workspaces.length === 0) {
      console.log("No workspaces found for user");
      return { success: false, error: "No workspaces found" };
    }

    console.log(
      `Syncing ${hubspotContacts.length} HubSpot contacts to ${workspaces.length} workspace(s)`,
    );

    const results = [];

    // Process each workspace
    for (const workspace of workspaces) {
      console.log(`Processing workspace: ${workspace.name} (${workspace.id})`);

      // Get the Person object for this workspace
      const personObject = await prisma.object.findFirst({
        where: {
          workspaceId: workspace.id,
          type: "PERSON",
        },
        include: {
          attributes: {
            where: {
              isArchived: false,
            },
          },
        },
      });

      if (!personObject) {
        console.log(`Person object not found in workspace ${workspace.id}`);
        continue;
      }

      // Find the email attribute (Primary email)
      const emailAttribute = personObject.attributes.find(
        (attr) => attr.attributeType === "EMAIL_ADDRESS" && attr.isUnique,
      );

      // Find the name attribute (Name)
      const nameAttribute = personObject.attributes.find(
        (attr) => attr.attributeType === "PERSONAL_NAME",
      );

      // Find the job title attribute
      const jobTitleAttribute = personObject.attributes.find(
        (attr) => attr.name === "Job title",
      );

      if (!emailAttribute) {
        console.log(`Email attribute not found in workspace ${workspace.id}`);
        continue;
      }

      let created = 0;
      let updated = 0;
      let skipped = 0;

      // Process each contact
      for (const contact of hubspotContacts) {
        // Extract email from the contact
        const email =
          contact.emails && contact.emails.length > 0
            ? contact.emails[0].email
            : null;

        if (!email) {
          skipped++;
          continue;
        }

        try {
          // Check if a Person record with this email already exists
          const existingRecord = await prisma.record.findFirst({
            where: {
              objectId: personObject.id,
              workspaceId: workspace.id,
              values: {
                some: {
                  attributeId: emailAttribute.id,
                  value: {
                    path: ["value"],
                    equals: email,
                  },
                },
              },
            },
          });

          if (existingRecord) {
            // Update existing record if needed
            const updates = [];

            // Update name if available and name attribute exists
            if (nameAttribute && (contact.firstName || contact.lastName)) {
              const fullName =
                `${contact.firstName || ""} ${contact.lastName || ""}`.trim();
              if (fullName) {
                updates.push({
                  attributeId: nameAttribute.id,
                  recordId: existingRecord.id,
                  value: { value: fullName },
                });
              }
            }

            // Update job title if available and job title attribute exists
            if (jobTitleAttribute && contact.jobTitle) {
              updates.push({
                attributeId: jobTitleAttribute.id,
                recordId: existingRecord.id,
                value: { value: contact.jobTitle },
              });
            }

            // Apply updates
            for (const update of updates) {
              await prisma.attributeValue.upsert({
                where: {
                  attributeId_recordId: {
                    attributeId: update.attributeId,
                    recordId: update.recordId,
                  },
                },
                update: {
                  value: update.value,
                },
                create: {
                  attributeId: update.attributeId,
                  recordId: update.recordId,
                  value: update.value,
                },
              });
            }

            updated++;
            console.log(
              `Updated Person record for ${email} in workspace ${workspace.id}`,
            );
          } else {
            // Create new Person record
            const newRecord = await prisma.record.create({
              data: {
                objectId: personObject.id,
                workspaceId: workspace.id,
              },
            });

            // Create attribute values
            const attributeValues = [
              {
                attributeId: emailAttribute.id,
                recordId: newRecord.id,
                value: { value: email },
              },
            ];

            // Add name if available and name attribute exists
            if (nameAttribute && (contact.firstName || contact.lastName)) {
              const fullName =
                `${contact.firstName || ""} ${contact.lastName || ""}`.trim();
              if (fullName) {
                attributeValues.push({
                  attributeId: nameAttribute.id,
                  recordId: newRecord.id,
                  value: { value: fullName },
                });
              }
            }

            // Add job title if available and job title attribute exists
            if (jobTitleAttribute && contact.jobTitle) {
              attributeValues.push({
                attributeId: jobTitleAttribute.id,
                recordId: newRecord.id,
                value: { value: contact.jobTitle },
              });
            }

            // Create all attribute values
            await prisma.attributeValue.createMany({
              data: attributeValues,
            });

            created++;
            console.log(
              `Created Person record for ${email} in workspace ${workspace.id}`,
            );
          }
        } catch (contactError) {
          console.error(`Error processing contact ${email}:`, contactError);
          skipped++;
        }
      }

      results.push({
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        created,
        updated,
        skipped,
      });

      console.log(
        `Workspace ${workspace.name}: Created ${created}, Updated ${updated}, Skipped ${skipped}`,
      );
    }

    const totalCreated = results.reduce((sum, r) => sum + r.created, 0);
    const totalUpdated = results.reduce((sum, r) => sum + r.updated, 0);
    const totalSkipped = results.reduce((sum, r) => sum + r.skipped, 0);

    console.log(
      `Sync completed: Created ${totalCreated}, Updated ${totalUpdated}, Skipped ${totalSkipped} Person records`,
    );

    return {
      success: true,
      results,
      summary: {
        totalCreated,
        totalUpdated,
        totalSkipped,
      },
    };
  } catch (error) {
    console.error("Error syncing HubSpot contacts to Person records:", error);
    return {
      success: false,
      error: error.message || "Failed to sync contacts",
    };
  }
}
