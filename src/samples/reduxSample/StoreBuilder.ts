/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as Redux from 'redux';

namespace StoreBuilder {
  const reducers: { [key: number]: any } = {};

  export function addReducer<TState, TAction extends Redux.Action<unknown>>(reducerKey: number, reducer: (state: TState, action: TAction) => TState): void {
    reducers[reducerKey] = reducer;
  }

  export function createStore() {
    const reducer = Redux.combineReducers(reducers);
    const store = Redux.createStore(reducer);
    return store;
  }
}

export default StoreBuilder;
