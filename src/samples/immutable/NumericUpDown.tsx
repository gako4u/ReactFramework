/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint no-redeclare: off */

import React from 'react';
import * as Redux from 'redux';
import Reducer from './Reducer';
import Immutable from '../utilities/Immutable';
import { Button } from 'samples/utilities/Button';

function NumericUpDown<TRoot>(
  props: {
    store: Redux.Store<any, Reducer.ReduxAction<any>>,
    reducerKey: string,
    countStateGetter: (root: Immutable<TRoot>) => Immutable<NumericUpDown.State>,
  }
): React.ReactElement {
  return (
    <>
      <span>
        <Button onClick={event => increment(props.store, props.reducerKey, props.countStateGetter, +1)}>+</Button>
        <Button onClick={event => increment(props.store, props.reducerKey, props.countStateGetter, -1)}>-</Button>
      </span>
    </>
  );
}

function increment<TState>(store: Redux.Store<any, Reducer.ReduxAction<any>>, reducerKey: string, countState: (root: Immutable<TState>) => Immutable<NumericUpDown.State>, value: number): void {
  store.dispatch({ type: Reducer.reduxActionType, reducerKey: reducerKey, stateUpdater: updateState } as Reducer.ReduxAction<TState>);

  function updateState(state: Immutable<TState>): void {
    countState(state).get("value").value += value;
  }
}

namespace NumericUpDown {
  export interface State { value: number; }

  export function createInitialState(): State { return { value: 0 }; }
}

export default NumericUpDown;
