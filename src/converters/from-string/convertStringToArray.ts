import defaults from "lodash.defaults";

import { expectType } from "../typeUtils";

interface StringToArrayConverterOption {
  separator: string;
}

const defaultOptions: StringToArrayConverterOption = {
  separator: ",",
};

/**
 * Converts a string to an array of strings using a separator to split it.
 * @param {string} data - string to be converted
 * @param {Object} options - converter options
 * @param {string} options.separator - override the separator used to split the string
 * @returns {string[]} an array of strings
 */
export default function convertStringToArray(
  data: string,
  options?: Partial<StringToArrayConverterOption>
): string[] {
  expectType(data, "string");

  if (data === "") {
    return [];
  }

  const fullOptions = defaults(
    options,
    defaultOptions
  ) as StringToArrayConverterOption;
  const separator = fullOptions.separator;

  return data.split(separator).map((item) => item.trim());
}
