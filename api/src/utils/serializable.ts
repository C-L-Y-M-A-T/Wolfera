export interface Serializable<T> {
  toDTO(...args: any[]): T;
}

// Type guard for Serializable objects
export function isSerializable(obj: any): obj is Serializable<unknown> {
  return typeof obj?.toDTO === 'function';
}

// Internal recursive function, not exported
function toRecursiveDTO<T>(source: any): T {
  if (source === null || source === undefined) {
    return source as T;
  }
  if (typeof source !== 'object') {
    return source as T;
  }
  if (source instanceof Date) {
    return source.toISOString() as T;
  }
  if (isSerializable(source)) {
    return toRecursiveDTO(source.toDTO());
  }
  if (Array.isArray(source)) {
    return source.map((item) => toRecursiveDTO(item)) as T;
  }
  const result: Record<string, any> = {};
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      result[key] = toRecursiveDTO(source[key]);
    }
  }
  return result as T;
}

// Exported function: takes Serializable<T> and returns T
export function toDTO<T extends Serializable<any>>(
  serializable: T,
): DeepDTO<T> {
  return toRecursiveDTO(serializable.toDTO());
}

type IsSerializable<T> = T extends Serializable<infer D> ? D : never;

export type DeepDTO<T> = T extends
  | string
  | number
  | boolean
  | null
  | undefined
  | Function
  | Date
  ? T
  : T extends Array<infer U>
    ? Array<DeepDTO<U>>
    : IsSerializable<T> extends never
      ? { [K in keyof T]: DeepDTO<T[K]> }
      : DeepDTO<IsSerializable<T>>;
