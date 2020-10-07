import * as React from "react";
import EquatableUtility from "../EquatableUtility";

export default function useMemoEx<T>(factory: () => T, deps: React.DependencyList | undefined): T {
  const prevDeps = React.useRef<React.DependencyList | undefined>(undefined);
  const resultMemo = React.useRef<T | undefined>(undefined);

  const result: T =
    areDepsEqual(prevDeps.current, deps)
      ? resultMemo.current!
      : factory();

  resultMemo.current = result;
  prevDeps.current = deps;

  return result;
}

function areDepsEqual(prev: React.DependencyList | undefined, next: React.DependencyList | undefined): boolean {
  if (prev === undefined) {
    return next === undefined;

  } else if (prev === null) {
    return next === null;

  } else if (next === undefined) {
    return false;

  } else if (next === null) {
    return false;

  } else if (prev.length !== next.length) {
    return false;

  } else {
    for (let i = 0; i < prev.length; i++) {
      if (!EquatableUtility.areEqual(prev[i], next[i])) {
        return false;
      }
    }
    return true;
  }
}
