import isNil from "lodash.isnil";

export type SupportedTypes =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array";

/**
 * Check if the value provided matchs the type specified.
 * @param {any} value - value
 * @param {string} type - type to check
 * @returns {boolean} if it matchs or not
 */
export function matchsType(value: any, type: SupportedTypes): boolean {
  if (Array.isArray(value)) {
    return type === "array";
  }
  return typeof value === type;
}

/**
 * Throw an error in case the value provided doesn't match the type specified.
 * @param {any} value - value
 * @param {string} type - type to check
 */
export function expectType(value: any, type: SupportedTypes) {
  if (isNil(value)) {
    throw new Error(`expected type "${type}", got nil value "${value}"`);
  }
  if (!matchsType(value, type)) {
    throw new Error(`expected type "${type}", got something else`);
  }
}
