import omitBy = require("lodash.omitby");
import defaults = require("lodash.defaults");
import {
  SupportedArray,
  SupportedData,
  SupportedObject,
} from "../transformerTypes";
import convert, {
  SchemaBasedConverters,
  defaultConverters,
} from "./schemaBasedConverter";
import {
  SchemaBasedValidators,
  ValidatorReportEntry,
  defaultValidators,
} from "./schemaBasedValidators";
import {
  SchemaDefinition,
  expectArraySchema,
  expectObjectSchema,
} from "./schemaDefinition";
import { expectType } from "../../converters/typeUtils";

export interface TransformUsingSchemaOptions
  extends SchemaBasedConverters,
    SchemaBasedValidators {
  validate?: boolean;
}

/**
 * Transforms and validate (if flagged) data to be in accordance with a provided schema.
 * @param data - data to be transformed
 * @param {Object} schema - schema to be followed
 * @param {Object} [options] options for customizing the transformation
 * @param {string} [path] used internally for recursive calls
 * @returns transformed data and validation report
 */
export default function transformUsingSchema(
  data: SupportedData,
  schema: SchemaDefinition,
  options?: Partial<TransformUsingSchemaOptions>,
  path?: string
): [SupportedData, ValidatorReportEntry[] | null] {
  if (!schema) {
    throw new Error("schema is required");
  }

  const fullOptions = defaults(options, defaultConverters, defaultValidators, {
    validate: true,
  }) as TransformUsingSchemaOptions;
  // init validation options
  const validate = !!fullOptions.validate;
  const enumValidator = fullOptions.enumValidator;
  const requiredPropertiesValidator = fullOptions.requiredPropertiesValidator;

  const validationReport: ValidatorReportEntry[] | null = validate ? [] : null;

  if (!data) {
    return [data, validationReport];
  }

  const value = convert(data, schema, fullOptions);

  if (schema.type === "object") {
    expectType(value, "object");
    expectObjectSchema(schema);

    const valueObject = value as SupportedObject;
    const propertySchemaMap = schema.properties!;

    const resultObject: SupportedObject = {};
    for (const [key, propertySchema] of Object.entries(propertySchemaMap)) {
      const propertyPath = path ? `${path}.${key}` : key;
      const propertyValue = valueObject[key];
      const [propertyValueTransformed, propertyValidationReport] =
        transformUsingSchema(
          propertyValue,
          propertySchema,
          fullOptions,
          propertyPath
        );
      if (validate && propertyValidationReport) {
        validationReport!.push(...propertyValidationReport);
      }
      resultObject[key] = propertyValueTransformed;
    }
    const result = omitBy(
      resultObject,
      (value: SupportedData) => value === undefined
    );
    if (validate) {
      const requiredPropertiesValidationReport = requiredPropertiesValidator(
        result,
        schema,
        path
      );
      if (validate && requiredPropertiesValidationReport) {
        validationReport!.push(...requiredPropertiesValidationReport);
      }
    }
    return [result, validationReport];
  }

  if (schema.type === "array") {
    expectArraySchema(schema);

    const arrayItemSchema = schema.items!;
    const resultArray = value as SupportedArray;
    const resultArrayTransformed = resultArray.map(
      (itemValue: SupportedData, itemIndex: number) => {
        const arrayPath = path ? `${path}[${itemIndex}]` : `[${itemIndex}]`;
        const [itemValueTransformed, arrayValidationReport] =
          transformUsingSchema(
            itemValue,
            arrayItemSchema,
            fullOptions,
            arrayPath
          );
        if (validate && arrayValidationReport) {
          validationReport!.push(...arrayValidationReport);
        }
        return itemValueTransformed;
      }
    );
    return [resultArrayTransformed, validationReport];
  }

  if (["number", "string", "boolean"].includes(schema.type)) {
    if (validate) {
      const report = enumValidator(value, schema, fullOptions, path);
      if (validate && report) {
        validationReport!.push(report);
      }
    }
    return [value, validationReport];
  }

  throw new Error(`Unsupported type: ${schema.type}`);
}
