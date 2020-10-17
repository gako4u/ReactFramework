/* eslint-disable @typescript-eslint/no-explicit-any */

import { isPlainObject } from 'is-plain-object';

type Immutable<T> = T extends [] ? ImmutableList<T> : ImmutableMap<T>;

export interface ImmutableMap<T> {
  get<TKey extends keyof T>(key: TKey): Immutable<T[TKey]>;

  value: T;
}

export interface ImmutableList<T> extends ImmutableMap<T> {
  readonly length: number;
}

namespace Immutable {
  export function create<T>(obj: T): Immutable<T>;
  export function create<T>(root: () => T, onUpdate: (newObject: T) => void): Immutable<T>;
  export function create<T>(arg0: T | (() => T), onUpdate?: (newObject: T) => void): Immutable<T> {
    if (typeof arg0 === "function") {
      return new Impl<T>(undefined, undefined, (arg0 as () => T), onUpdate!) as unknown as Immutable<T>;
    } else {
      return new Impl<T>(undefined, undefined, () => (arg0 as unknown as T), (newObject: T) => { }) as unknown as Immutable<T>;
    }
  }

  class Impl<T> implements ImmutableList<T> {
    public constructor(
      private parent: Impl<any> | undefined,
      private readonly key: PropertyKey | undefined,
      private readonly valueGetter: () => T,
      private readonly onUpdate: (newObject: T) => void,
    ) {
    }

    private readonly properties = new Map<keyof T, Impl<any>>();

    public get<TKey extends keyof T>(key: TKey): Immutable<T[TKey]> {
      if (this.properties.has(key)) {
        return this.properties.get(key)! as unknown as Immutable<T[TKey]>;
      } else {
        const result = new Impl<T[TKey]>(this, key, () => this.valueGetter()[key], value => this.setProperty(key, value));
        this.properties.set(key, result);
        return result as unknown as Immutable<T[TKey]>;
      }
    }

    public get value(): T {
      return this.valueGetter();
    }

    public set value(value: T) {
      this.onUpdate(value);
    }

    private readonly asList = this as unknown as (T extends (infer U)[] ? ImmutableList<(U)[]> : never);

    public get length(): number {
      return this.asList.get("length").value;
    }

    private setProperty<TKey extends keyof T>(key: TKey, value: T[TKey]): void {
      let thisValue = this.valueGetter();
      if (Array.isArray(thisValue)) {
        thisValue = [...thisValue] as unknown as T;
      } else if (isPlainObject(thisValue)) {
        thisValue = { ...thisValue };
      }
      thisValue[key] = value;

      this.onUpdate(thisValue);
    }
  }
}

export default Immutable;
