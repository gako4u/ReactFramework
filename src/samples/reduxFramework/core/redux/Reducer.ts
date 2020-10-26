/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Core from '.';
import DeepReadonly from 'samples/utilities/DeepReadonly';
import Immutable from 'samples/utilities/Immutable';

export class Reducer<TState> {
  public constructor(store: Core.Store, reducerKey: Core.ReducerKey, initialStateCreator: () => TState) {
    this.reducerFunction = this.reducerFunction.bind(this);
    this.connect = this.connect.bind(this);
    this.store = store;
    this.reducerKey = reducerKey;
    this.initialStateCreator = initialStateCreator;
  }

  public readonly store: Core.Store;

  public readonly reducerKey: Core.ReducerKey;

  private readonly initialStateCreator: () => TState;

  public reducerFunction(state: TState, reduxAction: Core.IReduxAction<TState>): TState {
    if (state === undefined) {
      state = this.initialStateCreator();
    }

    if (reduxAction?.type === this.store.reduxActionType) {
      if (reduxAction.reducerKey === this.reducerKey) {
        const immutable = Immutable.create(() => state, newObject => state = newObject);
        reduxAction.stateUpdater(immutable);
      }
    }

    return state;
  }

  public connect<TComponent extends React.ComponentType<TProps>, TProps>(reactComponentType: TComponent): TComponent {
    const componentEnhancer =
      ReactRedux.connect(
        (state: any) => ({ __state__: state[this.reducerKey] } as ComponentPropsBase<TState>),
        (dispatch) => ({} as ComponentPropsBase<TState>),
      );

    const cast = reactComponentType as unknown as React.ComponentType<ComponentPropsBase<TState>>;

    const result = componentEnhancer(cast as any);
    return result;
  }

  public getState(): TState {
    const rootState = this.store.reduxStore.getState();
    const result = rootState[this.reducerKey];
    return result as TState;
  }

  public updateState(stateUpdater: (nextState: Immutable<TState>) => void): void {
    const reduxAction: Core.IReduxAction<TState> = {
      type: this.store.reduxActionType,
      reducerKey: this.reducerKey,
      stateUpdater: stateUpdater,
    };

    this.store.reduxStore.dispatch(reduxAction);
  }

  public updateStateAsync(stateUpdater: (nextState: Immutable<TState>) => void): Promise<TState> {
    return new Promise<TState>((resolve, reject) => {
      try {
        this.updateState(stateUpdater);
        resolve(this.getState());
      } catch (error) {
        reject(error);
      }
    });
  }

  public GetStateFromConnectedProps(props: unknown): DeepReadonly<TState> {
    return (props as ComponentPropsBase<TState>).__state__ as DeepReadonly<TState>;
  }
}

interface ComponentPropsBase<TState> {
  __state__: TState;
}
