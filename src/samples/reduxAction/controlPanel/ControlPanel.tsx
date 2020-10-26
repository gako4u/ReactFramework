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
          <Button onClick={event => fire1Action()} enabled={fireButtonEnabled}>Fire! 1</Button>
          <Button onClick={event => fire2Action()} enabled={fireButtonEnabled}>Fire! 2</Button>
        </div>
        <div>
          {props.partState!.states.map((state, idx) => <div key={idx}>{state}</div>)}
        </div>
      </div>
    </>
  );
});

const incrementAction = store.create<number>(
  (nextRootState, payload) => {
    const length = nextRootState.controlPanel.states.length;

    nextRootState.controlPanel = {
      ...nextRootState.controlPanel,
      states: ControlPanelState.initializeStates(length + payload),
    };
  }
);

async function fire1Action(): Promise<void> {
  try {
    await setBusy.invokeAsync(true);

    await Utility.sleep(500);

    const rootState = store.getRootState();
    for (let idx = 0; idx < rootState.controlPanel.states.length; idx++) {
      await fire(idx, 500);
    }

    await Utility.sleep(500);

  } finally {
    await setBusy.invokeAsync(false);
  }
}

async function fire2Action(): Promise<void> {
  try {
    const rootState = store.getRootState();

    await setBusy.invokeAsync(true);

    const promises: Promise<void>[] = [];
    for (let idx = 0; idx < rootState.controlPanel.states.length; idx++) {
      const p = fire(idx, (idx + 1) * 500);
      promises.push(p);
    }
    await Promise.all(promises);

    await Utility.sleep(500);

  } finally {
    await setBusy.invokeAsync(false);
  }
}

const setBusy = store.create<boolean>(
  (nextRootState, payload) => {
    nextRootState.controlPanel = {
      ...nextRootState.controlPanel,
      isBusy: payload,
    };
  }
);

async function fire(index: number, delay: number): Promise<void> {
  await setStateAction.invokeAsync({ index: index, state: ControlPanelState.State.StandBy });
  await Utility.sleep(500);
  await setStateAction.invokeAsync({ index: index, state: ControlPanelState.State.Ready });
  await Utility.sleep(delay);
  await setStateAction.invokeAsync({ index: index, state: ControlPanelState.State.Fire });
}

const setStateAction = store.create<{ index: number, state: ControlPanelState.State }>(
  (nextRootState, payload) => {
    const newStates = [...nextRootState.controlPanel.states];
    newStates[payload.index] = payload.state;

    nextRootState.controlPanel = {
      ...nextRootState.controlPanel,
      states: newStates,
    };
  }
);
