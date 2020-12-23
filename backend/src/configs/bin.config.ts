import { days, minutes } from '../utils/time.util';

export const KEY_LENGTH = 10;
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 1000;
export const MAX_NAME_LENGTH = 100;
export const MAX_FILES = 25;
export const CDN_CACHE_CONTROL = `public, max-age=${days(1) / 1000}`;
export const HIT_COUNT_WINDOW = minutes(15);
