export type TValueOf<T> = T[keyof T];

export type RemoveFunctions<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
};
