import { AttributeType } from "@prisma/client";
import { z } from "zod";

// Create a mapping of attribute types to Zod schemas
export const getSchemaForAttributeType = (attributeType) => {
  switch (attributeType) {
    case AttributeType.NUMBER:
      return z.coerce.number();
    case AttributeType.CURRENCY:
      return z.coerce.number();
    case AttributeType.RATING:
      return z.coerce.number();
    case AttributeType.CHECKBOX:
      return z
        .boolean()
        .or(z.enum(["true", "false"]).transform((val) => val === "true"));
    case AttributeType.DATE:
      return z.coerce.date();
    case AttributeType.TIMESTAMP:
      return z.coerce.date();
    case AttributeType.SELECT:
      return z.string();
    case AttributeType.MULTI_SELECT:
      return z
        .array(z.string())
        .or(z.string().transform((val) => val.split(",")));
    default:
      return z.string();
  }
};

// Validate between operator which takes min and max values
export const getBetweenSchema = (attributeType) => {
  const baseSchema = getSchemaForAttributeType(attributeType);
  return z.object({
    min: baseSchema,
    max: baseSchema,
  });
};

// Specialized schema for "in" operator which takes an array of values
export const getInSchema = (attributeType) => {
  return z.array(getSchemaForAttributeType(attributeType));
};

export const validateAndConvertFilters = async (filters, attributes) => {
  if (!filters || !filters.length) return [];

  const validatedFilters = [];
  const errors = [];

  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    const attribute = attributes.find((attr) => attr.id === filter.attributeId);

    if (!attribute) {
      errors.push(`Filter ${i + 1}: Attribute not found`);
      continue;
    }

    try {
      let schema;

      // Choose schema based on operator
      if (filter.operator === "between") {
        schema = getBetweenSchema(attribute.attributeType);
      } else if (filter.operator === "in") {
        schema = getInSchema(attribute.attributeType);
      } else {
        schema = getSchemaForAttributeType(attribute.attributeType);
      }

      // Validate and transform the value
      const validatedValue = await schema.parseAsync(filter.value);

      validatedFilters.push({
        ...filter,
        value: validatedValue,
      });
    } catch (error) {
      errors.push(`Filter for ${attribute.name}: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join(", ")}`);
  }

  return validatedFilters;
};
