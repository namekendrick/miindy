import prisma from "@/lib/prisma";
import {
  validateRequiredInput,
  validateRequiredArray,
  validateRecordBelongsToObject,
  validateAttributeForUpdate,
  validateAttributeValue,
  createErrorCollector,
} from "@/features/workflows/utils/common-validators";
import {
  createStandardExecutor,
  WorkflowError,
  WORKFLOW_ERROR_TYPES,
  handleExecutorSuccess,
} from "@/features/workflows/utils/error-handling";

const updateRecordExecutorFn = async (environment) => {
  const objectId = validateRequiredInput(
    environment.getInput("Object"),
    "Object",
  );

  const recordId = validateRequiredInput(
    environment.getInput("Record"),
    "Record",
  );

  const selectedAttributes = validateRequiredArray(
    environment.getInput("Attributes"),
    "Attributes",
  );

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

  try {
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

    validateRecordBelongsToObject(record, objectId, recordId);

    const updates = [];
    const errorCollector = createErrorCollector();

    for (const [attributeId, value] of Object.entries(attributeValues)) {
      try {
        const attribute = await prisma.attribute.findUnique({
          where: { id: attributeId },
          select: {
            attributeType: true,
            config: true,
            isReadOnly: true,
            name: true,
          },
        });

        if (!validateAttributeForUpdate(attribute, attributeId)) {
          environment.log.warn(
            `Skipping read-only attribute: ${attribute.name}`,
          );
          continue;
        }

        const formattedValue = validateAttributeValue(value, attribute);

        const existingValue = await prisma.attributeValue.findFirst({
          where: {
            recordId: recordId,
            attributeId: attributeId,
          },
        });

        if (existingValue) {
          if (formattedValue === null || formattedValue === "") {
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
        errorCollector.add(
          `Failed to update attribute ${attributeId}: ${error.message}`,
        );
      }
    }

    if (errorCollector.hasErrors()) {
      environment.log.error(
        `Errors during update: ${errorCollector.getErrors().join(", ")}`,
      );
    }

    if (updates.length > 0) {
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

      const formattedRecord = {
        id: updatedRecord.id,
        objectId: updatedRecord.objectId,
        values: updatedRecord.values.reduce((acc, val) => {
          acc[val.attribute.name] = val.value?.value;
          return acc;
        }, {}),
        updatedAt: updatedRecord.updatedAt,
      };

      return handleExecutorSuccess(
        environment,
        { "Updated record": formattedRecord },
        `Successfully updated record ${recordId}: ${updates.join(", ")}`,
      );
    } else {
      throw new WorkflowError(
        WORKFLOW_ERROR_TYPES.VALIDATION_ERROR,
        "No updates were made - all provided values were empty or invalid",
      );
    }
  } catch (error) {
    if (error instanceof WorkflowError) {
      throw error;
    }
    throw new WorkflowError(
      WORKFLOW_ERROR_TYPES.DATABASE_ERROR,
      `Failed to update record: ${error.message}`,
      undefined,
      { originalError: error },
    );
  }
};

export const UpdateRecordExecutor = createStandardExecutor(
  updateRecordExecutorFn,
  {
    name: "Update Record",
    validateInputs: false,
  },
);
