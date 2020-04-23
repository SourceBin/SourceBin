type UserType = import('./models/User').User;

declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface User extends UserType {}
}

declare module '@sourcebin/linguist' {
  export const languages: any;
}
