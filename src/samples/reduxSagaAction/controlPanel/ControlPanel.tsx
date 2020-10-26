/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import * as Core from '../core';
import store from '../store';
import ControlPanelState from './ControlPanelState';
import { Button } from "samples/utilities/Button";
import Utility from 'samples/utilities/Utility';

interface Props extends Core.IComponentPropsBase<ControlPanelState> {
}

export const ControlPanel = store.connect<Props>(rootState => rootState.controlPanel, props => {
  const incrementButtonEnabled = !props.partState!.isBusy && props.partState!.states.length < 10;
  const decrementButtonEnabled = !props.partState!.isBusy && 0 < props.partState!.states.length;
  const fireButtonEnabled = !props.partState!.isBusy;

  return (
    <>
      <div>
        <div>
          {props.partState!.states.length}
        </div>
        <div>
          <Button onClick={event => incrementAction.invoke(+1)} enabled={incrementButtonEnabled}>+</Button>
          <Button onClick={event => incrementAction.invoke(-1)} enabled={decrementButtonEnabled}>-</Button>
          <Button onClick={event => fire1Action.invoke(undefined)} enabled={fireButtonEnabled}>Fire! 1</Button>
          <Button onClick={event => fire2Action.invoke(undefined)} enabled={fireButtonEnabled}>Fire! 2</Button>
        </div>
        <div>
          {props.partState!.states.map((state, idx) => <div key={idx}>{state}</div>)}
        </div>
      </div>
    </>
  );
});

const incrementAction = store.createUpdateState<number>(
  (nextRootState, payload) => {
    const length = nextRootState.controlPanel.states.length;

    nextRootState.controlPanel = {
      ...nextRootState.controlPanel,
      states: ControlPanelState.initializeStates(length + payload),
    };
  }
);

const fire1Action = store.createSaga<undefined>(
  function* (rootState, payload) {
    try {
      yield store.callAction(setBusy, true);

      for (let idx = 0; idx < rootState.controlPanel.states.length; idx++) {
        yield fire(idx, 500);
      }

      yield store.callPromise(() => Utility.sleep(500));

    } finally {
      yield store.callAction(setBusy, false);
    }
  }
);

const fire2Action = store.createSaga<undefined>(
  function* (rootState, payload) {
    try {
      yield store.callAction(setBusy, true);

      const tasks: any[] = [];
      for (let idx = 0; idx < rootState.controlPanel.states.length; idx++) {
        const task: any = yield store.forkGenerator(() => fire(idx, (idx + 1) * 500));
        tasks.push(task);
      }
      yield store.joinAll(tasks);

      yield store.callPromise(() => Utility.sleep(500));

    } finally {
      yield store.callAction(setBusy, false);
    }
  }
);

const setBusy = store.createUpdateState<boolean>(
  (nextRootState, payload) => {
    nextRootState.controlPanel = {
      ...nextRootState.controlPanel,
      isBusy: payload,
    };
  }
);

function* fire(index: number, delay: number): Generator {
  yield store.callAction(setStateAction, { index: index, state: ControlPanelState.State.StandBy });
  yield store.callPromise(() => Utility.sleep(500));
  yield store.callAction(setStateAction, { index: index, state: ControlPanelState.State.Ready });
  yield store.callPromise(() => Utility.sleep(delay));
  yield store.callAction(setStateAction, { index: index, state: ControlPanelState.State.Fire });
}

const setStateAction = store.createUpdateState<{ index: number, state: ControlPanelState.State }>(
  (nextRootState, payload) => {
    const newStates = [...nextRootState.controlPanel.states];
    newStates[payload.index] = payload.state;

    nextRootState.controlPanel = {
      ...nextRootState.controlPanel,
      states: newStates,
    };
  }
);
