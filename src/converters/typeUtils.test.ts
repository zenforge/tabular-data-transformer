import { matchsType, expectType } from "./typeUtils";

describe("matchsType", () => {
  test("returns true for matching types", () => {
    expect(matchsType("hello", "string")).toBe(true);
    expect(matchsType(123, "number")).toBe(true);
    expect(matchsType(true, "boolean")).toBe(true);
    expect(matchsType({}, "object")).toBe(true);
    expect(matchsType([], "array")).toBe(true);
  });

  test("returns false for non-matching types", () => {
    expect(matchsType(123, "string")).toBe(false);
    expect(matchsType("hello", "number")).toBe(false);
    expect(matchsType(true, "object")).toBe(false);
    expect(matchsType({}, "array")).toBe(false);
    expect(matchsType([], "boolean")).toBe(false);
  });
});

describe("expectType", () => {
  test("throws error for nil values", () => {
    expect(() => expectType(null, "string")).toThrow(
      'expected type "string", got nil value "null"',
    );
    expect(() => expectType(undefined, "number")).toThrow(
      'expected type "number", got nil value "undefined"',
    );
  });

  test("throws error for non-matching types", () => {
    expect(() => expectType(123, "string")).toThrow(
      'expected type "string", got something else',
    );
    expect(() => expectType("hello", "boolean")).toThrow(
      'expected type "boolean", got something else',
    );
    expect(() => expectType([], "object")).toThrow(
      'expected type "object", got something else',
    );
  });

  test("does not throw error for matching types", () => {
    expect(() => expectType("hello", "string")).not.toThrow();
    expect(() => expectType(123, "number")).not.toThrow();
    expect(() => expectType(true, "boolean")).not.toThrow();
    expect(() => expectType({}, "object")).not.toThrow();
    expect(() => expectType([], "array")).not.toThrow();
  });
});
