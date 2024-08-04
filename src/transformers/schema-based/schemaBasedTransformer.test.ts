import transformUsingSchema from "./schemaBasedTransformer";

describe("schemaBasedTransformer", () => {
  test("should handle nested schemas", () => {
    const nestedSchema = {
      type: "object",
      properties: {
        name: { type: "string" },
        address: {
          type: "object",
          properties: {
            street: { type: "string" },
            city: { type: "string" },
            zip: { type: "number" },
          },
          required: ["street", "city", "zip"],
        },
      },
      required: ["name", "address"],
    };

    const data = {
      name: "John Doe",
      address: {
        street: "123 Main St",
        city: "Anytown",
        zip: "12345",
      },
    };

    const expected = {
      name: "John Doe",
      address: {
        street: "123 Main St",
        city: "Anytown",
        zip: 12345,
      },
    };

    const [result] = transformUsingSchema(data, nestedSchema);
    expect(result).toEqual(expected);
  });

  test("should handle arrays of objects", () => {
    const schema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
        },
        required: ["id", "name"],
      },
    };

    const data = [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
      { id: 3, name: "Item 3" },
    ];

    const expected = [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
      { id: 3, name: "Item 3" },
    ];

    const [result] = transformUsingSchema(data, schema);
    expect(result).toEqual(expected);
  });

  test("should handle optional properties", () => {
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
        email: { type: "string" },
      },
      required: ["name", "age"],
    };

    const data = {
      name: "John Doe",
      age: 30,
    };

    const expected = {
      name: "John Doe",
      age: 30,
    };

    const [result] = transformUsingSchema(data, schema);
    expect(result).toEqual(expected);
  });

  test("should validate required properties", () => {
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
        email: { type: "string" },
      },
      required: ["name", "age"],
    };

    const data = {
      age: "30",
      email: "john.doe@mail.com",
    };

    const expected = {
      age: 30,
      email: "john.doe@mail.com",
    };

    const [result, validationReport] = transformUsingSchema(data, schema, {
      validate: true,
    });
    expect(result).toEqual(expected);
    expect(validationReport).toStrictEqual([
      {
        path: "name",
        message: 'required property is missing: "name"',
      },
    ]);
  });

  test("should validate converted enum values", () => {
    const schema = {
      type: "object",
      properties: {
        score: {
          type: "number",
          enum: ["1", "2", "3", "4", "5"],
        },
      },
    };

    const data = {
      score: "1",
    };

    const expected = {
      score: 1,
    };

    const [result, validationReport] = transformUsingSchema(data, schema);
    expect(result).toStrictEqual(expected);
    expect(validationReport).toStrictEqual([]);

    const data2 = {
      score: "6",
    };

    const expected2 = {
      score: 6,
    };

    const [result2, validationReport2] = transformUsingSchema(data2, schema);
    expect(result2).toStrictEqual(expected2);
    expect(validationReport2).toStrictEqual([
      {
        message: '"6" is not in the enum: 1,2,3,4,5',
        path: "score",
      },
    ]);
  });
});
