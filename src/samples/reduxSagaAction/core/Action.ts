/* eslint-disable @typescript-eslint/no-explicit-any */

import * as Core from '.';

export class Action<TRootState, TPayload> {
  public constructor(
    public readonly store: Core.Store<TRootState>,
    public readonly updateState?: (nextRootState: TRootState, payload: TPayload) => void,
    public readonly saga?: (nextRootState: TRootState, payload: TPayload) => Generator<unknown, any, unknown>,
  ) {
    this.updateState = this.updateState?.bind(this);
    this.saga = this.saga?.bind(this);
    this.invoke = this.invoke.bind(this);
  }

  public invoke(payload: TPayload): void {
    const reduxAction: Core.IReduxAction<TRootState, TPayload> = {
      type: this.store.defaultReduxActionType,
      action: this,
      payload: payload,
    };

    this.store.reduxStore.dispatch<Core.IReduxAction<TRootState, TPayload>>(reduxAction);
  }
}
