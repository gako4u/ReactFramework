import * as Redux from 'redux';
import * as Core from '.';
import Immutable from 'samples/utilities/Immutable';

export interface IReduxAction<TState> extends Redux.Action<string> {
  stateUpdater: (nextState: Immutable<TState>) => void;

  reducerKey: Core.ReducerKey;
}
