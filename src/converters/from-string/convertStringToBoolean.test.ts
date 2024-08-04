import convertStringToBoolean from "./convertStringToBoolean";

describe("convertStringToBoolean", () => {
  it("should return true for default true values", () => {
    expect(convertStringToBoolean("true")).toBe(true);
    expect(convertStringToBoolean("True")).toBe(true);
    expect(convertStringToBoolean("TRUE")).toBe(true);
    expect(convertStringToBoolean("1")).toBe(true);
  });

  it("should return false for values not in the default true values list", () => {
    expect(convertStringToBoolean("false")).toBe(false);
    expect(convertStringToBoolean("False")).toBe(false);
    expect(convertStringToBoolean("0")).toBe(false);
    expect(convertStringToBoolean("")).toBe(false);
    expect(convertStringToBoolean("yes")).toBe(false);
  });

  it("should return true for custom true values", () => {
    const options = { trueValues: ["yes", "YES", "y"] };
    expect(convertStringToBoolean("yes", options)).toBe(true);
    expect(convertStringToBoolean("YES", options)).toBe(true);
    expect(convertStringToBoolean("y", options)).toBe(true);
  });

  it("should return false for values not in the custom true values list", () => {
    const options = { trueValues: ["yes", "YES", "y"] };
    expect(convertStringToBoolean("true", options)).toBe(false);
    expect(convertStringToBoolean("True", options)).toBe(false);
    expect(convertStringToBoolean("1", options)).toBe(false);
    expect(convertStringToBoolean("no", options)).toBe(false);
  });

  it("should handle case where options is undefined", () => {
    expect(convertStringToBoolean("true", undefined)).toBe(true);
    expect(convertStringToBoolean("false", undefined)).toBe(false);
  });

  it("should throw error for non-string input", () => {
    expect(() => convertStringToBoolean(1 as any)).toThrow();
    expect(() => convertStringToBoolean(true as any)).toThrow();
    expect(() => convertStringToBoolean(null as any)).toThrow();
  });
});
