interface ControlPanelState {
  isBusy: boolean;

  itemStates: ControlPanelState.ItemState[];
}

namespace ControlPanelState {
  export enum ItemState {
    StandBy = "Stand By.",
    Ready = "Get Ready.",
    Fire = "Fire!",
  }

  export function create(): ControlPanelState {
    return {
      isBusy: false,
      itemStates: createItemStates(3),
    };
  }

  export function createItemStates(length: number): ItemState[] {
    return Array(length).fill(ItemState.StandBy) as ItemState[];
  }
}

export default ControlPanelState;
