/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

namespace EquatableUtility {
  export function areEqual<T extends any | null | undefined>(a: T, b: T): boolean {
    if (a === undefined) {
      return b === undefined;

    } else if (a === null) {
      return b === null;

    } else if (b === undefined) {
      return false;

    } else if (b === null) {
      return false;

    } else {
      const maybeFunction = (a as any)["equals"];
      if (typeof maybeFunction === "function") {
        return (maybeFunction as (other: T) => boolean)(b);

      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();

      } else {
        return Object.is(a, b);
      }
    }
  }
}

export default EquatableUtility;
