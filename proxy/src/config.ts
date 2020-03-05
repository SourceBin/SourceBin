import { seconds, hours, mb } from './units';

export const timeout = seconds(60);
export const proxyTimeout = seconds(60);

export const defaultCacheControl = `public, max-age=${hours(12) / 1000}`;

export const maxContentLength = mb(10);
export const maxContentLengthUnknown = mb(1);
