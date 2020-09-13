/* eslint-disable @typescript-eslint/no-explicit-any */

type DeepReadonly<T> =
  T extends Primitive ? T :
  T extends (...args: any[]) => any ? T :
  T extends ReadonlyArray<infer TElement> ? ReadonlyArray<DeepReadonly<TElement>> :
  T extends ReadonlyMap<infer TKey, infer TValue> ? ReadonlyMap<DeepReadonly<TKey>, DeepReadonly<TValue>> :
  T extends ReadonlySet<infer TElement> ? ReadonlySet<DeepReadonly<TElement>> :
  T extends object ? { readonly [P in keyof T]: DeepReadonly<T[P]>; } :
  never;

export type Primitive =
  undefined
  | null
  | number
  | bigint
  | boolean
  | string
  | symbol
  ;

export default DeepReadonly;
