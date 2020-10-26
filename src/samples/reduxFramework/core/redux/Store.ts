/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */

import * as Redux from 'redux';
import * as Core from '.';
import MapUtility from 'samples/utilities/MapUtility';

export class Store {
  public constructor(reducActionType: Core.IReduxAction<unknown>["type"]) {
    this.reduxActionType = reducActionType;
  }

  public readonly reduxActionType: Core.IReduxAction<unknown>["type"];

  private readonly reducers = new Map<Core.ReducerKey, Core.Reducer<any>>();

  private reduxStoreInternal: Redux.Store<any, Core.IReduxAction<any>> | undefined;

  public get reduxStore(): Redux.Store<any, Core.IReduxAction<any>> {
    if (!this.reduxStoreInternal) {
      const combinedReducer = this.createReducer(this.reducers);
      this.reduxStoreInternal = Redux.createStore<unknown, Core.IReduxAction<unknown>, unknown, unknown>(combinedReducer);
    }
    return this.reduxStoreInternal;
  }

  public reset(): void {
    this.reduxStoreInternal = undefined;
  }

  public AddReducer<TState>(reducerKey: Core.ReducerKey, initialStateCreator: () => TState): Core.Reducer<TState> {
    if (this.reducers.has(reducerKey)) {
      throw new Error("Reducer Key が重複");
    }

    const reducer = new Core.Reducer<TState>(this, reducerKey, initialStateCreator);
    this.reducers.set(reducerKey, reducer);
    return reducer;
  }

  private createReducer(reducers: Map<Core.ReducerKey, Core.Reducer<any>>): Redux.Reducer<unknown, Core.IReduxAction<unknown>> {
    const reducerObject = MapUtility.ToPlainObject(this.reducers, key => key, val => val.reducerFunction);
    return Redux.combineReducers<any, Core.IReduxAction<unknown>>(reducerObject);
  }

  public getReducer<TState>(reducerKey: Core.ReducerKey): Core.Reducer<TState> {
    if (!this.reducers.has(reducerKey)) {
      throw new Error("指定したキーに紐付くリデューサーが見つかりません。");
    }

    return this.reducers.get(reducerKey) as Core.Reducer<TState>;
  }
}
