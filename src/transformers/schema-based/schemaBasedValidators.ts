import isEmpty from "lodash.isempty";

import { expectType } from "../../converters/typeUtils";
import { SupportedData, SupportedObject } from "../transformerTypes";
import convert, { SchemaBasedConverters } from "./schemaBasedConverter";
import { SchemaDefinition, expectObjectSchema } from "./schemaDefinition";

export type ValidatorReportEntry = { path?: string; message: string };

export interface SchemaBasedValidators {
  enumValidator: (
    data: SupportedData,
    schema: SchemaDefinition,
    converters: SchemaBasedConverters,
    path?: string
  ) => ValidatorReportEntry | null;
  requiredPropertiesValidator: (
    data: SupportedData,
    schema: SchemaDefinition,
    path?: string
  ) => ValidatorReportEntry[] | null;
}

export const defaultValidators: SchemaBasedValidators = {
  enumValidator: (
    data: SupportedData,
    schema: SchemaDefinition,
    converters: SchemaBasedConverters,
    path?: string
  ) => {
    if (schema.enum?.length) {
      if (
        !schema.enum
          .map((item) => convert(item, schema, converters))
          .includes(data)
      ) {
        return {
          path,
          message: `"${data}" is not in the enum: ${schema.enum}`,
        };
      }
    }
    return null;
  },
  requiredPropertiesValidator: (
    data: SupportedData,
    schema: SchemaDefinition,
    path?: string
  ) => {
    expectType(data, "object");
    expectObjectSchema(schema);

    const object = data as SupportedObject;
    const requiredPropertiesKeys = schema.required;
    const validationReport: ValidatorReportEntry[] = [];
    if (requiredPropertiesKeys?.length) {
      for (const key of requiredPropertiesKeys) {
        if (isEmpty(object[key]) && typeof object[key] !== "number") {
          validationReport.push({
            path: path ? `${path}.${key}` : key,
            message: `required property is missing: "${key}"`,
          });
        }
      }
    }
    return validationReport.length ? validationReport : null;
  },
};
