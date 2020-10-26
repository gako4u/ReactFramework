import * as Redux from 'redux';

interface ReduxAction<TActionType, TPayload> extends Redux.Action<TActionType> {
  payload?: TPayload;
}

export default ReduxAction;
