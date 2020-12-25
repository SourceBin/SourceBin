import { Document } from 'mongoose';

export function mockObject<T>(Type: new () => T, data: Partial<T>): T {
  const obj = new Type();
  Object.assign(obj, data);
  return obj;
}

export function mockDocument<T>(
  Type: new () => T,
  data: Partial<T>,
): T & Document {
  return mockObject(Type, data) as T & Document;
}
