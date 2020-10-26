interface ControlPanelState {
  isBusy: boolean;

  states: ControlPanelState.State[];
}

namespace ControlPanelState {
  export enum State {
    StandBy = "Stand By.",
    Ready = "Get Ready.",
    Fire = "Fire!",
  }

  export function create(): ControlPanelState {
    return {
      isBusy: false,
      states: initializeStates(3),
    };
  }

  export function initializeStates(length: number): State[] {
    return Array(length).fill(State.StandBy) as State[];
  }
}

export default ControlPanelState;
