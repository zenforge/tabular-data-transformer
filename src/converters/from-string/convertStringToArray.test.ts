import convertStringToArray from "./convertStringToArray";

describe("convertStringToArray", () => {
  it("should convert a string to an array of strings using the default separator", () => {
    expect(convertStringToArray("apple,banana,orange")).toEqual([
      "apple",
      "banana",
      "orange",
    ]);
  });

  it("should convert a string to an array of strings using a custom separator", () => {
    const options = { separator: "|" };
    expect(convertStringToArray("apple|banana|orange", options)).toEqual([
      "apple",
      "banana",
      "orange",
    ]);
  });

  it("should trim whitespace from each item in the resulting array", () => {
    expect(convertStringToArray("  apple  ,  banana  ,  orange  ")).toEqual([
      "apple",
      "banana",
      "orange",
    ]);
  });

  it("should return an empty array for an empty string", () => {
    expect(convertStringToArray("")).toEqual([]);
  });

  it("should throw an error for non-string input", () => {
    expect(() => convertStringToArray(123 as any)).toThrow();
    expect(() => convertStringToArray(null as any)).toThrow();
    expect(() => convertStringToArray(undefined as any)).toThrow();
  });
});
