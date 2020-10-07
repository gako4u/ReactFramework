import React from "react";
import useMemoEx from "../hooks/useMemoEx";

export default function Memo(props: { deps: React.DependencyList | undefined, children: React.ReactElement }): React.ReactElement {
  const reactElement = useMemoEx(() => <>{props.children}</>, props.deps);
  return reactElement;
}
