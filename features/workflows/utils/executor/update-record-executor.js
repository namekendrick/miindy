import prisma from "@/lib/prisma";

export const UpdateRecordExecutor = async (environment) => {
  const objectId = environment.getInput("Object");
  const recordId = environment.getInput("Record");
  const selectedAttributes = environment.getInput("Attributes");

  // Get all dynamic attribute values
  const attributeValues = {};
  if (selectedAttributes && Array.isArray(selectedAttributes)) {
    for (const attrId of selectedAttributes) {
      const value = environment.getInput(`attribute_${attrId}`);
      if (value !== undefined) attributeValues[attrId] = value || "";
    }
  }

  environment.log.info(
    `Processing ${Object.keys(attributeValues).length} attribute(s) for update`,
  );

  if (!objectId || !recordId) {
    environment.log.error(
      "Missing required inputs: Object and Record are required",
    );
    environment.setOutput("Success", false);
    return false;
  }

  if (!selectedAttributes || selectedAttributes.length === 0) {
    environment.log.error("No attributes selected for update");
    environment.setOutput("Success", false);
    return false;
  }

  try {
    // Get the record to verify it exists and belongs to the correct object
    const record = await prisma.record.findUnique({
      where: { id: recordId },
      include: {
        object: true,
        values: {
          include: {
            attribute: true,
          },
        },
      },
    });

    if (!record) {
      environment.log.error(`Record not found: ${recordId}`);
      environment.setOutput("Success", false);
      return false;
    }

    if (record.objectId !== objectId) {
      environment.log.error(
        `Record ${recordId} does not belong to object ${objectId}`,
      );
      environment.setOutput("Success", false);
      return false;
    }

    const updates = [];
    const errors = [];

    // Update each attribute value
    for (const [attributeId, value] of Object.entries(attributeValues)) {
      try {
        // Get attribute details to validate the value
        const attribute = await prisma.attribute.findUnique({
          where: { id: attributeId },
          select: {
            attributeType: true,
            config: true,
            isReadOnly: true,
            name: true,
          },
        });

        if (!attribute) {
          errors.push(`Attribute ${attributeId} not found`);
          continue;
        }

        if (attribute.isReadOnly) {
          environment.log.warn(
            `Skipping read-only attribute: ${attribute.name}`,
          );
          continue;
        }

        // Validate and format value based on attribute type
        let formattedValue = value;

        switch (attribute.attributeType) {
          case "NUMBER":
          case "CURRENCY":
          case "RATING":
            formattedValue = value !== "" ? parseFloat(value) : null;
            if (formattedValue !== null && isNaN(formattedValue)) {
              errors.push(`Invalid number value for ${attribute.name}`);
              continue;
            }
            break;

          case "CHECKBOX":
            formattedValue =
              value === true ||
              value === "true" ||
              value === 1 ||
              value === "1";
            break;

          case "DATETIME":
            if (value) {
              const date = new Date(value);
              if (isNaN(date.getTime())) {
                errors.push(`Invalid date value for ${attribute.name}`);
                continue;
              }
              formattedValue = date.toISOString();
            }
            break;

          case "STATUS":
            if (value && attribute.config?.options) {
              const validStatuses = attribute.config.options.map(
                (opt) => opt.status,
              );
              if (!validStatuses.includes(value)) {
                errors.push(
                  `Invalid status value for ${attribute.name}. Must be one of: ${validStatuses.join(", ")}`,
                );
                continue;
              }
            }
            break;
        }

        // Check if value already exists
        const existingValue = await prisma.attributeValue.findFirst({
          where: {
            recordId: recordId,
            attributeId: attributeId,
          },
        });

        // Update or create the value
        if (existingValue) {
          if (formattedValue === null || formattedValue === "") {
            // Delete empty values
            await prisma.attributeValue.delete({
              where: { id: existingValue.id },
            });
            updates.push(`Cleared ${attribute.name}`);
          } else {
            await prisma.attributeValue.update({
              where: { id: existingValue.id },
              data: {
                value: { value: formattedValue },
              },
            });
            updates.push(`Updated ${attribute.name} to ${formattedValue}`);
          }
        } else if (formattedValue !== null && formattedValue !== "") {
          // Only create if not empty
          await prisma.attributeValue.create({
            data: {
              recordId: recordId,
              attributeId: attributeId,
              value: { value: formattedValue },
            },
          });
          updates.push(`Set ${attribute.name} to ${formattedValue}`);
        }
      } catch (error) {
        errors.push(
          `Failed to update attribute ${attributeId}: ${error.message}`,
        );
      }
    }

    if (errors.length > 0) {
      environment.log.error(`Errors during update: ${errors.join(", ")}`);
    }

    if (updates.length > 0) {
      environment.log.info(
        `Successfully updated record ${recordId}: ${updates.join(", ")}`,
      );

      // Fetch the updated record
      const updatedRecord = await prisma.record.findUnique({
        where: { id: recordId },
        include: {
          values: {
            include: {
              attribute: true,
            },
          },
        },
      });

      // Format the output
      const formattedRecord = {
        id: updatedRecord.id,
        objectId: updatedRecord.objectId,
        values: updatedRecord.values.reduce((acc, val) => {
          acc[val.attribute.name] = val.value?.value;
          return acc;
        }, {}),
        updatedAt: updatedRecord.updatedAt,
      };

      environment.setOutput("Updated record", formattedRecord);
      environment.setOutput("Success", true);
      return true;
    } else {
      environment.log.warn("No updates were made");
      environment.setOutput("Success", false);
      return false;
    }
  } catch (error) {
    environment.log.error(`Failed to update record: ${error.message}`);
    environment.setOutput("Success", false);
    return false;
  }
};
