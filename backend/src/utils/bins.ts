import crypto from 'crypto';

export function isValid(content?: string): content is string {
  if (typeof content !== 'string') {
    return false;
  }

  // TODO: Add more checks
  return true;
}

export function generateKey(): string {
  return crypto.randomBytes(5).toString('hex');
}
