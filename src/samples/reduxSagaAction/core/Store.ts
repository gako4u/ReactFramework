/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */

import * as React from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as ReduxSaga from 'redux-saga';
import createSagaMiddleware from 'redux-saga';
import * as ReduxSagaEffects from 'redux-saga/effects';
import * as Core from '.';

export class Store<TRootState> {
  public constructor(rootStateInitializer: () => TRootState) {
    this.reducer = this.reducer.bind(this);
    this.takeAll = this.takeAll.bind(this);
    this.callSaga = this.callSaga.bind(this);
    this.connect = this.connect.bind(this);
    this.create = this.create.bind(this);
    this.createUpdateState = this.createUpdateState.bind(this);
    this.createSaga = this.createSaga.bind(this);
    this.callAction = this.callAction.bind(this);
    this.callPromise = this.callPromise.bind(this);
    this.forkGenerator = this.forkGenerator.bind(this);
    this.forkPromise = this.forkPromise.bind(this);
    this.join = this.join.bind(this);
    this.joinAll = this.joinAll.bind(this);

    this.rootStateInitializer = rootStateInitializer;
    this.sagaMiddleware = createSagaMiddleware();
    this.reduxStore = Redux.createStore<TRootState, Core.IReduxAction<TRootState, any>, unknown, unknown>(this.reducer, Redux.applyMiddleware(this.sagaMiddleware));
    this.sagaMiddleware.run(this.takeAll);
  }

  public readonly reduxStore: Redux.Store<TRootState, Core.IReduxAction<TRootState, any>>;

  private readonly sagaMiddleware: ReduxSaga.SagaMiddleware<any>;

  private readonly rootStateInitializer: () => TRootState;

  public readonly defaultReduxActionType = "____DEFAULT_REDUX_ACTION_TYPE____";

  private reducer(rootState: TRootState | undefined, reduxAction: Core.IReduxAction<TRootState, unknown>): TRootState {
    let result = rootState ?? this.rootStateInitializer();

    if (reduxAction.action?.updateState) {
      result = { ...result };
      reduxAction.action.updateState(result, reduxAction.payload);
    }

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private * takeAll() {
    yield ReduxSagaEffects.takeEvery(this.defaultReduxActionType, (reduxAction: Core.IReduxAction<TRootState, unknown>) => this.callSaga(reduxAction));
  }

  private * callSaga(reduxAction: Core.IReduxAction<TRootState, unknown>): Generator {
    if (reduxAction.action.saga) {
      const rootState = yield ReduxSagaEffects.select();
      yield ReduxSagaEffects.call(reduxAction.action.saga, rootState as TRootState, reduxAction.payload);
    }
  }

  public connect<TProps, TPartState = TProps extends Core.IComponentPropsBase<infer U> ? U : never>(stateSelector: (rootState: TRootState) => TPartState, reactComponentType: React.ComponentType<TProps>): React.ComponentType<TProps> {
    const componentEnhancer = ReactRedux.connect<Core.IComponentPropsBase<TPartState>, {}, Core.IComponentPropsBase<TPartState>, TRootState>(rootState => ({ partState: stateSelector(rootState) }));
    return componentEnhancer(reactComponentType as any);
  }

  public create<TPayload>(
    updateState: (this: Core.Action<TRootState, TPayload>, nextRootState: TRootState, payload: TPayload) => void,
    saga: (this: Core.Action<TRootState, TPayload>, rootState: TRootState, payload: TPayload) => Generator<unknown, any, unknown>,
  ): Core.Action<TRootState, TPayload> {
    const result = new Core.Action<TRootState, TPayload>(this, updateState, saga);
    return result;
  }

  public createUpdateState<TPayload>(
    updateState: (this: Core.Action<TRootState, TPayload>, nextRootState: TRootState, payload: TPayload) => void
  ): Core.Action<TRootState, TPayload> {
    const result = new Core.Action<TRootState, TPayload>(this, updateState, undefined);
    return result;
  }

  public createSaga<TPayload>(
    saga: (this: Core.Action<TRootState, TPayload>, rootState: TRootState, payload: TPayload) => Generator<unknown, any, unknown>
  ): Core.Action<TRootState, TPayload> {
    const result = new Core.Action<TRootState, TPayload>(this, undefined, saga);
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public callAction<TActionRootState, TActionPayload>(action: Core.Action<TActionRootState, TActionPayload>, payload: TActionPayload) {
    const reduxAction: Core.IReduxAction<TActionRootState, TActionPayload> = {
      type: this.defaultReduxActionType,
      action: action,
      payload: payload,
    };

    return ReduxSagaEffects.put(reduxAction);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public callPromise<Fn extends (...args: any[]) => Promise<any>>(fn: Fn, ...args: Parameters<Fn>) {
    return ReduxSagaEffects.call(fn, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public forkGenerator<Fn extends (...args: any[]) => Generator>(fn: Fn, ...args: Parameters<Fn>) {
    return ReduxSagaEffects.fork(fn, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public forkPromise<Fn extends (...args: any[]) => Promise<any>>(fn: Fn, ...args: Parameters<Fn>) {
    return ReduxSagaEffects.fork(fn, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public join(task: ReduxSaga.Task) {
    return ReduxSagaEffects.join(task);
  }

  public * joinAll(tasks: ReduxSaga.Task[]): Generator {
    for (const task of tasks) {
      yield this.join(task);
    }
  }
}
