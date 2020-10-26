/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */

import * as React from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Core from '.';

export class Store<TRootState> {
  public constructor(rootStateInitializer: () => TRootState) {
    this.reducer = this.reducer.bind(this);
    this.connect = this.connect.bind(this);
    this.create = this.create.bind(this);

    this.rootStateInitializer = rootStateInitializer;
    this.reduxStore = Redux.createStore<TRootState, Core.IReduxAction<TRootState, any>, unknown, unknown>(this.reducer);
  }

  public readonly reduxStore: Redux.Store<TRootState, Core.IReduxAction<TRootState, any>>;

  private readonly rootStateInitializer: () => TRootState;

  public readonly defaultReduxActionType = "____DEFAULT_REDUX_ACTION_TYPE____";

  private reducer(rootState: TRootState | undefined, reduxAction: Core.IReduxAction<TRootState, unknown>): TRootState {
    let result = rootState ?? this.rootStateInitializer();

    result = { ...result };
    reduxAction.action.updateState(result, reduxAction.payload);

    return result;
  }

  public connect<TProps, TPartState = TProps extends Core.IComponentPropsBase<infer U> ? U : never>(stateSelector: (rootState: TRootState) => TPartState, reactComponentType: React.ComponentType<TProps>): React.ComponentType<TProps> {
    const componentEnhancer = ReactRedux.connect<Core.IComponentPropsBase<TPartState>, {}, Core.IComponentPropsBase<TPartState>, TRootState>(rootState => ({ partState: stateSelector(rootState) }));
    return componentEnhancer(reactComponentType as any);
  }

  public create<TPayload>(updateState: (this: Core.Action<TRootState, TPayload>, nextRootState: TRootState, payload: TPayload) => void): Core.Action<TRootState, TPayload> {
    const result = new Core.Action<TRootState, TPayload>(this, updateState);
    return result;
  }

  public getRootState(): TRootState {
    return this.reduxStore.getState();
  }
}
