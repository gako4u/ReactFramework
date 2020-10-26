/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as React from 'react';
import * as ReactRedux from 'react-redux';
import StoreBuilder from './StoreBuilder';
import { Button, ButtonClickEvent } from 'samples/utilities/Button';
import Utility from 'samples/utilities/Utility';
import State from './State';
import ReduxAction from './ReduxAction';

interface Props {
  state?: State;
  dispatch?: (reduxAction: ReduxAction<ActionType, ButtonClickEvent>) => void;
}

enum ActionType {
  Increment = Utility.generateUuid(),
  Decrement = Utility.generateUuid(),
}

function CounterWithMapStateToProps(props: Props): React.ReactElement<Props> {
  return (
    <>
      <div>
        <div>
          {props.state!.value}
        </div>
        <div>
          <Button onClick={event => props.dispatch!({ type: ActionType.Increment, payload: event })}>+</Button>
          <Button onClick={event => props.dispatch!({ type: ActionType.Decrement, payload: event })}>-</Button>
        </div>
      </div>
    </>
  );
}

export default ReactRedux.connect(mapStateToProps)(CounterWithMapStateToProps);

const reducerKey = Utility.generateUuid();
StoreBuilder.addReducer(reducerKey, reducer);

function reducer(state: State = State.initialize(1), reduxAction: ReduxAction<ActionType, unknown>): State {
  switch (reduxAction.type) {
    case ActionType.Increment: return { value: state.value + 1 };
    case ActionType.Decrement: return { value: state.value - 1 };
    default: return state;
  }
}

function mapStateToProps(rootState: any): Partial<Props> {
  return { state: rootState[reducerKey] };
}
