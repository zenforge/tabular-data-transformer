export type SchemaDefinition = {
  type: string;
  title?: string;
  description?: string;
  items?: SchemaDefinition;
  properties?: { [key: string]: SchemaDefinition };
  enum?: string[];
  defaultValue?: string;
  required?: string[];
};

export function expectObjectSchema(schema: SchemaDefinition) {
  if (schema.type !== "object") {
    throw new Error(`schema type "object" expected, but got: "${schema.type}"`);
  }
  if (!schema.properties) {
    throw new Error(
      `schema type "object" should contain "properties" property`,
    );
  }
}

export function expectArraySchema(schema: SchemaDefinition) {
  if (schema.type !== "array") {
    throw new Error(`schema type "array" expected, but got: "${schema.type}"`);
  }
  if (!schema.items) {
    throw new Error(`schema type "array" should contain "items" property`);
  }
}
