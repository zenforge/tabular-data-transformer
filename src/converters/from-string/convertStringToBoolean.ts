import defaults from "lodash.defaults";

import { expectType } from "../typeUtils";

interface StringToBooleanConverterOption {
  trueValues: string[];
}

const defaultOptions: StringToBooleanConverterOption = {
  trueValues: ["true", "True", "TRUE", "1"],
};

/**
 * Converts a string to boolean.
 * Consider true by default string values that matches "true", "True", "TRUE" or "1" and false for anything else.
 * @param {string} data - string to be converted
 * @param {Object} options - converter options
 * @param {Array} options.trueValues - override the list of string values considered true
 * @returns {boolean} boolean value
 */
export default function convertStringToBoolean(
  data: string,
  options?: Partial<StringToBooleanConverterOption>
): boolean {
  expectType(data, "string");

  const fullOptions = defaults(
    options,
    defaultOptions
  ) as StringToBooleanConverterOption;
  const trueValues = fullOptions.trueValues;

  return trueValues.includes(data);
}
