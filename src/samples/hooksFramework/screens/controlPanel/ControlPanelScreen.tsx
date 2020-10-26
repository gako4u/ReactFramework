import * as React from 'react';
import Core from '../../core/Core';
import ControlPanelState from './ControlPanelState';
import { Button } from "samples/utilities/Button";
import Utility from 'samples/utilities/Utility';

export default class ControlPanelScreen extends Core.Screen<ControlPanelState> {
  public get caption(): string {
    return "ControlPanel";
  }

  protected get initialStateCreator(): () => ControlPanelState {
    return ControlPanelState.create;
  }

  protected get Component(): (props: Core.ScreenComponentProps) => Core.ReactElement {
    return Component;
  }
}

function Component(props: Core.ScreenComponentProps): Core.ReactElement {
  const state = Core.useScreenState<ControlPanelState>();
  const dispatcher = Core.useScreenDispatcher<ControlPanelState>();

  const incrementButtonEnabled = !state.isBusy && state.itemStates.length < 10;
  const decrementButtonEnabled = !state.isBusy && 0 < state.itemStates.length;
  const fireButtonEnabled = !state.isBusy;

  return (
    <>
      <div>
        <div>
          {state.itemStates.length}
        </div>
        <div>
          <Button onClick={event => increment(dispatcher, +1)} enabled={incrementButtonEnabled}>+</Button>
          <Button onClick={event => increment(dispatcher, -1)} enabled={decrementButtonEnabled}>-</Button>
          <Button onClick={event => fire1(dispatcher)} enabled={fireButtonEnabled}>Fire! 1</Button>
          <Button onClick={event => fire2(dispatcher)} enabled={fireButtonEnabled}>Fire! 2</Button>
        </div>
        <div>
          {state.itemStates.map((state, idx) => <div key={idx}>{state}</div>)}
        </div>
      </div>
    </>
  );
}

function increment(dispatcher: Core.Dispatcher<ControlPanelState>, value: number): void {
  dispatcher.updateState(stateDraft => {
    const length = stateDraft.get("itemStates").get("length").value;
    stateDraft.get("itemStates").value = ControlPanelState.createItemStates(length + value);
  });
}

async function fire1(dispatcher: Core.Dispatcher<ControlPanelState>): Promise<void> {
  try {
    await dispatcher.updateStateAsync(stateDraft => stateDraft.get("isBusy").value = true);
    await Utility.sleep(500);
    const state = dispatcher.getState();
    for (let idx = 0; idx < state.itemStates.length; idx++) {
      await fire(dispatcher, idx, 500);
    }
    await Utility.sleep(500);
  } finally {
    await dispatcher.updateStateAsync(stateDraft => stateDraft.get("isBusy").value = false);
  }
}

async function fire2(dispatcher: Core.Dispatcher<ControlPanelState>): Promise<void> {
  try {
    const state = dispatcher.getState();
    await dispatcher.updateStateAsync(stateDraft => stateDraft.get("isBusy").value = true);
    const promises: Promise<void>[] = [];
    for (let idx = 0; idx < state.itemStates.length; idx++) {
      const p = fire(dispatcher, idx, (idx + 1) * 500);
      promises.push(p);
    }
    await Promise.all(promises);
    await Utility.sleep(500);
  } finally {
    await dispatcher.updateStateAsync(stateDraft => stateDraft.get("isBusy").value = false);
  }
}

async function fire(dispatcher: Core.Dispatcher<ControlPanelState>, index: number, delay: number): Promise<void> {
  await dispatcher.updateStateAsync(stateDraft => stateDraft.get("itemStates").get(index).value = ControlPanelState.ItemState.StandBy);
  await Utility.sleep(500);
  await dispatcher.updateStateAsync(stateDraft => stateDraft.get("itemStates").get(index).value = ControlPanelState.ItemState.Ready);
  await Utility.sleep(delay);
  await dispatcher.updateStateAsync(stateDraft => stateDraft.get("itemStates").get(index).value = ControlPanelState.ItemState.Fire);
}
