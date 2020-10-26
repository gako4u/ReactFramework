import * as React from 'react';
import { Button } from "samples/utilities/Button";

interface State {
  count: number;
}

interface Props {
}

const Context = React.createContext<State>({ count: 1 });

export function ControlPanel(props: Props): React.ReactElement {
  const [state, setState] = React.useState<State>(() => ({ count: 0 }));
  const mousePosition = useMousePosition();

  return (
    <>
      <div>
        <div>
          <div>left: {mousePosition.left}</div>
          <div>top: {mousePosition.top}</div>
        </div>
        <div>
          {state.count}
        </div>
        <div>
          <Button onClick={event => setState(prev => increment(prev, +1))}>+</Button>
          <Button onClick={event => setState(prev => increment(prev, -1))}>-</Button>
        </div>
        <div><Sub /></div>
      </div>
    </>
  );
}

function Sub(): React.ReactElement {
  const contextState = React.useContext(Context);
  return <div>{contextState.count}</div>;
}

function increment(prevState: State, value: number): State {
  return { count: prevState.count + value };
}

function useMousePosition(): { left: number, top: number } {
  const [position, setPosition] = React.useState(() => ({ left: 0, top: 0 }));

  React.useEffect(
    () => {
      function handleWindowMouseMove(e: MouseEvent): void {
        setPosition({ left: e.pageX, top: e.pageY });
      }

      window.addEventListener('mousemove', handleWindowMouseMove);
      return () => window.removeEventListener('mousemove', handleWindowMouseMove);
    }
    , []
  );

  return position;
}
