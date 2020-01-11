import crypto from 'crypto';

import { bin } from '../config';

export function isValidContent(content: any): content is string {
  if (typeof content !== 'string') {
    return false;
  }

  return content.length > 0 && content.length <= bin.maxContentLength;
}

export function isValidLanguage(language: any): language is string {
  if (typeof language !== 'string') {
    return false;
  }

  return language.length > 0 && language.length <= bin.maxLanguageLength;
}

export function generateKey(): string {
  return crypto.randomBytes(5).toString('hex');
}
