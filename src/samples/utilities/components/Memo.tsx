import * as React from "react";

export default function Memo(props: { deps: React.DependencyList | undefined, children: React.ReactElement }): React.ReactElement {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reactElement = React.useMemo(() => <>{props.children}</>, props.deps);
  return reactElement;
}
