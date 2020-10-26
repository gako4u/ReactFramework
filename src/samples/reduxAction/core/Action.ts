import * as Core from '.';

export class Action<TRootState, TPayload> {
  public constructor(
    public readonly store: Core.Store<TRootState>,
    public readonly updateState: (nextRootState: TRootState, payload: TPayload) => void,
  ) {
    this.updateState = this.updateState?.bind(this);
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

  public invokeAsync(payload: TPayload): Promise<TRootState> {
    const reduxAction: Core.IReduxAction<TRootState, TPayload> = {
      type: this.store.defaultReduxActionType,
      action: this,
      payload: payload,
    };

    return new Promise<TRootState>((resolve, reject) => {
      try {
        this.store.reduxStore.dispatch<Core.IReduxAction<TRootState, TPayload>>(reduxAction);
        const rootState = this.store.getRootState();
        resolve(rootState);
      } catch (error) {
        reject(error);
      }
    });
  }
}
