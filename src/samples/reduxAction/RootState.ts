import ControlPanelState from "./controlPanel/ControlPanelState";

interface RootState {
  controlPanel: ControlPanelState;
}

namespace RootState {
  export function createInitial(): RootState {
    return {
      controlPanel: ControlPanelState.create(),
    };
  }
}

export default RootState;
