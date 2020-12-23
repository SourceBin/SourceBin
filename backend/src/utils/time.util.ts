export const milliseconds = (x: number): number => x;
export const seconds = (x: number): number => x * milliseconds(1000);
export const minutes = (x: number): number => x * seconds(60);
export const hours = (x: number): number => x * minutes(60);
export const days = (x: number): number => x * hours(24);
export const weeks = (x: number): number => x * days(7);
export const years = (x: number): number => x * weeks(52);
