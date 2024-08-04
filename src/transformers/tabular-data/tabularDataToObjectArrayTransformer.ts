import defaults = require("lodash.defaults");
import camelCase = require("lodash.camelcase");
import { ValidatorReportEntry } from "../schema-based/schemaBasedValidators";
import { SupportedObject } from "../transformerTypes";
import {
  NoHeaderStrategy,
  TransformTabularDataOptions,
  defaultOptions,
} from "./tabularDataTransformer";
import transformUsingSchema from "../schema-based/schemaBasedTransformer";

const toObjectArrayDefaultOptions = defaults(
  {},
  defaultOptions,
) as TransformTabularDataOptions;

export default function transformTabularDataToObjectsArray(
  rows: any[][],
  options?: Partial<TransformTabularDataOptions>,
): [SupportedObject[], ValidatorReportEntry[][] | null] {
  options = defaults(options, toObjectArrayDefaultOptions);
  const { header, noHeaderStrategy, schema, schemaOptions } = options;

  let labels: string[] | undefined = header;
  let values = rows;
  if (!header || header.length === 0) {
    switch (noHeaderStrategy) {
      case NoHeaderStrategy.FirstRow: {
        labels = rows[0];
        values = rows.slice(1);
        break;
      }
      case NoHeaderStrategy.Index: {
        labels = [
          ...new Set(
            rows.reduce(
              (indexes, row) => [
                ...indexes,
                ...row.map((cell, index) => `${index}`),
              ],
              [],
            ),
          ),
        ];
        values = rows;
        break;
      }
      default: {
        throw new Error(
          `Invalid 'noHeaderStrategy' configuration: "${noHeaderStrategy}"`,
        );
      }
    }
  }

  const objects: any[] = [];
  const propertyKeys = labels!.map((label) => camelCase(label));
  const validationReports: ValidatorReportEntry[][] | null =
    schemaOptions?.validate ? [] : null;
  values.forEach((row) => {
    const object = row.reduce(
      (obj, value, index) => ({
        ...obj,
        [propertyKeys[index]]: value,
      }),
      {},
    );

    if (schema) {
      const [result, validationReport] = transformUsingSchema(
        object,
        schema,
        schemaOptions,
      );
      if (schemaOptions?.validate && validationReport) {
        validationReports!.push(validationReport);
      }
      objects.push(result);
    } else {
      objects.push(object);
    }
  });

  return [objects, validationReports];
}
