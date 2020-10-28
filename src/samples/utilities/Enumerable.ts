interface Enumerable<T> extends Iterable<T> {
  toString(separator: string): string;

  select<TResult>(selector: (value: T, index: number) => TResult): Enumerable<TResult>;

  toArray(): T[];
}

namespace Enumerable {
  export function from<T>(items: Iterable<T>): Enumerable<T> {
    return new Impl<T>(items);
  }
}

class Impl<T> implements Enumerable<T> {
  public constructor(
    private readonly items: Iterable<T>
  ) {
  }

  public [Symbol.iterator](): Iterator<T> {
    return this.items[Symbol.iterator]();
  }

  public toString(separator: string = ""): string {
    let result = "";
    let first = true;
    for (const item of this.items) {
      if (first) {
        first = false;
      } else {
        result += separator;
      }

      result += item;
    }

    return result;
  }

  public select<TResult>(selector: (value: T, index: number) => TResult): Enumerable<TResult> {
    return new Impl(selectInternal(this.items, selector));

    function* selectInternal<TResult>(items: Iterable<T>, selector: (value: T, index: number) => TResult): Iterable<TResult> {
      let i = -1;
      for (const item of items) {
        yield selector(item, ++i);
      }
    }
  }

  public toArray(): T[] {
    const result: T[] = [];

    for (const item of this) {
      result.push(item);
    }

    return result;
  }
}

export default Enumerable;
