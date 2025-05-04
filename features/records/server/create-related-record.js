"use server";

import prisma from "@/lib/prisma";

export const createRelatedRecord = async (values) => {
  const { recordId, relatedRecordId, attributeId } = values;

  const attribute = await prisma.attribute.findUnique({
    where: { id: attributeId },
    include: {
      sourceRelationship: true,
      object: true,
    },
  });

  if (!attribute) return { status: 404, message: "Attribute not found!" };

  const relationship = attribute.sourceRelationship;

  if (!relationship && attribute.attributeType === "RELATIONSHIP")
    return { status: 400, message: "Relationship configuration not found!" };

  let attributeBId = null;
  let targetAttribute = null;

  if (attribute.attributeType === "RELATIONSHIP") {
    if (relationship.targetAttributeId) {
      attributeBId = relationship.targetAttributeId;

      targetAttribute = await prisma.attribute.findUnique({
        where: { id: attributeBId },
        include: { sourceRelationship: true },
      });
    } else {
      const targetRecord = await prisma.record.findUnique({
        where: { id: relatedRecordId },
        select: { objectId: true },
      });

      const matchingAttribute = await prisma.attribute.findFirst({
        where: {
          objectId: targetRecord.objectId,
          attributeType: "RELATIONSHIP",
          sourceRelationship: {
            targetAttributeId: attributeId,
          },
        },
        include: { sourceRelationship: true },
      });

      if (matchingAttribute) {
        attributeBId = matchingAttribute.id;
        targetAttribute = matchingAttribute;
      }
    }
  }

  const { relationshipType } = relationship;

  if (relationshipType === "ONE_TO_ONE") {
    // Clean up source side
    await prisma.relatedRecord.deleteMany({
      where: {
        OR: [
          { recordAId: recordId, attributeAId: attributeId },
          { recordBId: recordId, attributeBId: attributeId },
        ],
      },
    });

    // Clean up target side
    if (attributeBId) {
      await prisma.relatedRecord.deleteMany({
        where: {
          OR: [
            { recordAId: relatedRecordId, attributeAId: attributeBId },
            { recordBId: relatedRecordId, attributeBId: attributeBId },
          ],
        },
      });
    }
  } else if (relationshipType === "MANY_TO_ONE") {
    // Clean up existing relationships for source record (many side)
    await prisma.relatedRecord.deleteMany({
      where: {
        OR: [
          { recordAId: recordId, attributeAId: attributeId },
          { recordBId: recordId, attributeBId: attributeId },
        ],
      },
    });
  } else if (relationshipType === "ONE_TO_MANY" && attributeBId) {
    // Clean up existing relationships for target record (many side)
    await prisma.relatedRecord.deleteMany({
      where: {
        OR: [
          { recordAId: relatedRecordId, attributeAId: attributeBId },
          { recordBId: relatedRecordId, attributeBId: attributeBId },
        ],
      },
    });
  } else if (relationshipType === "MANY_TO_MANY") {
    // Just prevent duplicates
    const existingRelationship = await prisma.relatedRecord.findFirst({
      where: {
        OR: [
          {
            recordAId: recordId,
            recordBId: relatedRecordId,
            attributeAId: attributeId,
          },
          attributeBId && {
            recordAId: relatedRecordId,
            recordBId: recordId,
            attributeAId: attributeBId,
          },
        ].filter(Boolean),
      },
    });

    if (existingRelationship) {
      return { status: 200, message: "Relationship already exists" };
    }
  }

  await prisma.relatedRecord.create({
    data: {
      recordAId: recordId,
      recordBId: relatedRecordId,
      attributeAId: attributeId,
      attributeBId,
    },
  });

  return { status: 200, message: "Relationship created" };
};
