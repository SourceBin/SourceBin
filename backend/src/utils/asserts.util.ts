export function asString(str?: string): string {
  if (typeof str !== 'string') {
    throw new Error(`${str} is not a string`);
  }

  return str;
}
