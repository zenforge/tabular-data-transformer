import defaults = require("lodash.defaults");
import { TransformUsingSchemaOptions } from "../schema-based/schemaBasedTransformer";
import { SchemaDefinition } from "../schema-based/schemaDefinition";
import transformTabularDataToObjectsArray from "./tabularDataToObjectArrayTransformer";

export enum NoHeaderStrategy {
  FirstRow = "first-row",
  Index = "index",
}

export interface TransformTabularDataOptions {
  header?: string[];
  noHeaderStrategy: NoHeaderStrategy;
  schema?: SchemaDefinition;
  schemaOptions?: Partial<TransformUsingSchemaOptions>;
}

export const defaultOptions = {
  noHeaderStrategy: NoHeaderStrategy.FirstRow,
} as const;

export default function transformTabularData(
  rows: any[][],
  options?: Partial<TransformTabularDataOptions>,
) {
  options = defaults(options, defaultOptions);
  return transformTabularDataToObjectsArray(rows, options);
}
