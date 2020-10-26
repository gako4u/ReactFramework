import * as Redux from 'redux';
import * as Core from '.';

export interface IReduxAction<TRootState, TPayload> extends Redux.Action<string> {
  action: Core.Action<TRootState, TPayload>;

  payload: TPayload;
}
