import crypto from 'crypto';

import { bin } from '../config';

export function isValidContent(content: any): content is string {
  if (typeof content !== 'string') {
    return false;
  }

  return content.length > 0 && content.length <= bin.maxContentLength;
}

export function isValidLanguageId(languageId: any): languageId is number {
  return Number.isInteger(languageId);
}

export function generateKey(): string {
  return crypto.randomBytes(5).toString('hex');
}
