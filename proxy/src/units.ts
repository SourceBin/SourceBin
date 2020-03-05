/* eslint-disable @typescript-eslint/explicit-function-return-type */

export const seconds = (x: number) => x * 1000;
export const minutes = (x: number) => x * seconds(60);
export const hours = (x: number) => x * minutes(60);

export const kb = (x: number) => x * 1000;
export const mb = (x: number) => x * kb(1000);
