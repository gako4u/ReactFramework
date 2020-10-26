import * as React from 'react';
import ControlPanelState from './ControlPanelState';
import application from '../application';
import { Button } from "samples/utilities/Button";
import Utility from 'samples/utilities/Utility';

const reducer = application.store.AddReducer("ControlPanel", ControlPanelState.create);

interface Props {
}

export const ControlPanel = reducer.connect((props: Props) => {
  const state = reducer.GetStateFromConnectedProps(props);
  const incrementButtonEnabled = !state.isBusy && state.states.length < 10;
  const decrementButtonEnabled = !state.isBusy && 0 < state.states.length;
  const fireButtonEnabled = !state.isBusy;

  return (
    <>
      <div>
        <div>
          {state.states.length}
        </div>
        <div>
          <Button onClick={event => increment(+1)} enabled={incrementButtonEnabled}>+</Button>
          <Button onClick={event => increment(-1)} enabled={decrementButtonEnabled}>-</Button>
          <Button onClick={event => fire1()} enabled={fireButtonEnabled}>Fire! 1</Button>
          <Button onClick={event => fire2()} enabled={fireButtonEnabled}>Fire! 2</Button>
        </div>
        <div>
          {state.states.map((state, idx) => <div key={idx}>{state}</div>)}
        </div>
      </div>
    </>
  );
});

function increment(value: number): void {
  reducer.updateState(nextState => {
    const length = nextState.get("states").get("length").value;
    nextState.get("states").value = ControlPanelState.initializeStates(length + value);
  });
}

async function fire1(): Promise<void> {
  try {
    await reducer.updateStateAsync(nextState => nextState.get("isBusy").value = true);

    await Utility.sleep(500);

    const state = reducer.getState();
    for (let idx = 0; idx < state.states.length; idx++) {
      await fire(idx, 500);
    }

    await Utility.sleep(500);

  } finally {
    await reducer.updateStateAsync(nextState => nextState.get("isBusy").value = false);
  }
}

async function fire2(): Promise<void> {
  try {
    const state = reducer.getState();

    await reducer.updateStateAsync(nextState => nextState.get("isBusy").value = true);

    const promises: Promise<void>[] = [];
    for (let idx = 0; idx < state.states.length; idx++) {
      const p = fire(idx, (idx + 1) * 500);
      promises.push(p);
    }
    await Promise.all(promises);

    await Utility.sleep(500);

  } finally {
    await reducer.updateStateAsync(nextState => nextState.get("isBusy").value = false);
  }
}

async function fire(index: number, delay: number): Promise<void> {
  await reducer.updateStateAsync(nextState => nextState.get("states").get(index).value = ControlPanelState.State.StandBy);
  await Utility.sleep(500);
  await reducer.updateStateAsync(nextState => nextState.get("states").get(index).value = ControlPanelState.State.Ready);
  await Utility.sleep(delay);
  await reducer.updateStateAsync(nextState => nextState.get("states").get(index).value = ControlPanelState.State.Fire);
}
