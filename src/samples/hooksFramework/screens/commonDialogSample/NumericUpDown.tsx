import * as React from "react";
import Core from "samples/hooksFramework/core/Core";
import { Button } from "samples/utilities/Button";
import Immutable from "samples/utilities/Immutable";

interface Props<TState> {
  state: TState;

  stateSelector: (state: Immutable<TState>) => Immutable<number>;
}

export default function NumericUpDown<TState>(props: Props<TState>): Core.ReactElement {
  const state = Immutable.create(props.state);
  const dispatcher = Core.useScreenDispatcher<TState>();
  return (
    <>
      {props.stateSelector(state).value}
      <span style={{ display: "inline-block", margin: "5px" }}>
        <Button onClick={e => dispatcher.updateState(stateDraft => props.stateSelector(stateDraft).value++)}>+</Button>
        <Button onClick={e => dispatcher.updateState(stateDraft => props.stateSelector(stateDraft).value--)}>+</Button>
      </span>
    </>
  );
}
