interface IEquatable<T> {
  equals(other: T): boolean;
}

namespace IEquatable {
  export function areEqual<T extends IEquatable<T> | null | undefined>(a: T, b: T): boolean {
    if (a === undefined) {
      return b === undefined;

    } else if (a === null) {
      return b === null;

    } else if (b === undefined) {
      return false;

    } else if (b === null) {
      return false;

    } else {
      return a.equals(b);
    }
  }
}

export default IEquatable;
