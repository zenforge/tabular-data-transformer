export type SupportedData =
  | string
  | number
  | boolean
  | SupportedObject
  | SupportedArray
  | undefined
  | null;
export type SupportedArray = SupportedData[];
export type SupportedObject = { [key: string]: SupportedData };
