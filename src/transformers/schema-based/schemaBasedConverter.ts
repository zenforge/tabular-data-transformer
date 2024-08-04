import isNil from "lodash.isnil";

import convertStringToArray from "../../converters/from-string/convertStringToArray";
import convertStringToBoolean from "../../converters/from-string/convertStringToBoolean";
import { matchsType } from "../../converters/typeUtils";
import { SupportedArray, SupportedData } from "../transformerTypes";
import { SchemaDefinition, expectArraySchema } from "./schemaDefinition";

export interface SchemaBasedConverters {
  arrayConverter: (
    data: SupportedData,
    schema: SchemaDefinition,
    converters: SchemaBasedConverters,
    path?: string
  ) => SupportedData[] | null | undefined;
  booleanConverter: (
    data: SupportedData,
    schema: SchemaDefinition,
    path?: string
  ) => boolean | null | undefined;
  numberConverter: (
    data: SupportedData,
    schema: SchemaDefinition,
    path?: string
  ) => number | null | undefined;
  stringConverter: (
    data: SupportedData,
    schema: SchemaDefinition,
    path?: string
  ) => string | null | undefined;
  customConverter: (
    data: SupportedData,
    schema: SchemaDefinition,
    path?: string
  ) => SupportedData | null | undefined;
}

/**
 * Converts a value that does not match the target schema type.
 * If the value already matches the target schema type, it is returned as it is.
 * @param value the value to be converted
 * @param targetSchema the target schema
 * @param converters the set of convertes being used
 * @param path the path of the value in the source object
 * @returns data converted to proper type
 */
export default function convert(
  data: SupportedData,
  targetSchema: SchemaDefinition,
  converters: SchemaBasedConverters,
  path?: string
): SupportedData | null | undefined {
  if (isNil(data)) {
    return data;
  }

  if (targetSchema.type === "array") {
    if (matchsType(data, "array")) {
      return data as SupportedArray;
    }
    return converters.arrayConverter(data, targetSchema, converters, path);
  }
  if (targetSchema.type === "boolean") {
    if (matchsType(data, "boolean")) {
      return data as boolean;
    }
    return converters.booleanConverter(data, targetSchema, path);
  }
  if (targetSchema.type === "number") {
    if (matchsType(data, "number")) {
      return data as number;
    }
    return converters.numberConverter(data, targetSchema, path);
  }
  if (targetSchema.type === "string") {
    if (matchsType(data, "string")) {
      return data as string;
    }
    return converters.stringConverter(data, targetSchema, path);
  }
  return converters.customConverter(data, targetSchema, path);
}

export const defaultConverters: SchemaBasedConverters = {
  arrayConverter: (
    data: SupportedData,
    schema: SchemaDefinition,
    converters: SchemaBasedConverters
  ) => {
    expectArraySchema(schema);
    const itemsSchema = schema.items!;

    if (matchsType(data, "string")) {
      const stringArray = convertStringToArray(data as string);
      return stringArray.map((item) => convert(item, itemsSchema, converters));
    }
    throw new Error(`default "arrayConverter" doesn't support type received`);
  },
  booleanConverter: (data: SupportedData) => {
    if (matchsType(data, "string")) {
      return convertStringToBoolean(data as string);
    }
    throw new Error(`default "booleanConverter" doesn't support type received`);
  },
  numberConverter: (data: SupportedData) => {
    return Number(data);
  },
  stringConverter: (data: SupportedData) => {
    return `${data}`;
  },
  customConverter: (data: SupportedData) => {
    return data;
  },
};
