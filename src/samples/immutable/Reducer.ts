import * as Redux from 'redux';
import Immutable from '../utilities/Immutable';

namespace Reducer {
  export const reduxActionType = "reduxActionType";

  export function create<TState>(stateCreator: () => TState, reducerKey: string) {
    return function (state: TState = stateCreator(), reduxAction: ReduxAction<TState>): TState {
      let result = state;

      if (reduxAction.type === reduxActionType) {
        if (reduxAction.reducerKey === reducerKey) {
          const map = Immutable.create(() => result, newObject => result = newObject);
          reduxAction.stateUpdater(map);
        }
      }

      return result;
    };
  }

  export interface ReduxAction<TState> extends Redux.Action<string> {
    reducerKey: string;
    stateUpdater: (state: Immutable<TState>) => void;
  }
}

export default Reducer;
