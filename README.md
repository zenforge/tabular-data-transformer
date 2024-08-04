# Tabular Data Transformer

A lightweight JavaScript library for transforming and validating tabular data.

## Features ✨

- Transforms tabular data (bidimensional arrays e.g, `any[][]`) into object arrays
- Support type inference for `number`, `boolean` and `array` types by default when provided with a schema
- Allows customization by modifying default type converters or adding support for custom types
- Performs basic validation, including checks for `enum` values and `required` fields

## Usage 💻

### Simplest use case

Tabular to object array data without type inference and validation. Header included in the data.

```js
const tabularData = [
  ["Name", "Age", "Gender"], // header labels included in the first row (you can provide a `header` option if data doesn't have it)
  ["Jane", "22", "Female"], // normal not-typed entry
  ["John", "16", "invalid-option"], // this example doesn't cover validation so "invalid-option" will be accepted
  ["Joe", 39, "Male"], // notice that pre-infered types (age) are supported and preserved
];

const [result] = transformTabularData(tabularData);

console.log(result);
```

#### Output

```js
[
  {
    name: "John",
    age: "16",
    gender: "Male",
  },
  {
    name: "Jane",
    age: "22",
    gender: "Female",
  },
  {
    name: "Joe",
    age: 39,
    gender: "invalid-option",
  },
];
```

## Default Export

### transformTabularData(rows: any[][], options?: TransformTabularDataOptions)

- `rows`: The tabular data to be transformed
- `options?`: Options to customize the transformation process

## Options

### header?: string[]

A list of header labels. It will be used to generate property keys for the result objects.

#### `header` Example

```js
["Full Name", "Birthdate", "Gender", "Interests"];
```

### noHeaderStrategy: "first-row" | "index"

If `header` option is not defined, this option will be used to determine how to generate property keys for the result objects.

- `first-row` (default): Use the first row as header labels
- `index`: Use the column index as properties' key

## schema?: SchemaDefinition

Describes the data and provide guidelines to the output. It is defined using a limited subset of the `JSON schema`. Check the type `SchemaDefinition` for more details.

### `schema` Example

```js
{
  title: "Person",
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    age: {
      type: "number",
    },
    gender: {
      type: "string",
      enum: ["Male", "Female"],
    },
    interests: {
      type: "array",
      items: {
        type: "string",
      },
    },
    employed: {
      type: "boolean",
    }
  },
  required: ["name", "age", "gender"],
}
```

## schemaOptions?: TransformUsingSchemaOptions

TODO

## What is Zenforge? 🤔

> `tabular-data-transformer` is part of the [`zenforge`](https://github.com/zenforgehq/zenforge) initiative.

**Zenforge** is a broad-scoped initiative with the mission of empowering people to build and prototype their ideas with simplicity and ease. We believe that moving fast is crucial and that experimentation is key to building a great final product.

Whether you lack resources or personnel, or ideas are flowing rapidly and the time to see results seems too long, it doesn't matter. For us, being able to go from thought to reality should be a quick process.
