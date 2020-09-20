import * as React from 'react';

interface Props {
  children?: React.ReactNode;
  enabled?: boolean;
  onClick?: (event: ButtonClickEvent) => void;
}

export function Button(props: Props): React.ReactElement {
  return (
    <button onClick={props.onClick} style={{ width: "100px", height: "50px" }} disabled={!(props.enabled ?? true)}>
      {props.children}
    </button>
  );
}

export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
