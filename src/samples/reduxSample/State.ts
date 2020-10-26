interface State {
  value: number;
}

namespace State {
  export function initialize(value: State["value"]): State {
    return { value: value };
  }
}

export default State;
