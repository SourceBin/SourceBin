import crypto from 'crypto';

export function generateKey(): string {
  return crypto.randomBytes(5).toString('hex');
}
