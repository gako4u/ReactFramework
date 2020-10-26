import React from "react";
import DeepReadonly from "samples/utilities/DeepReadonly";

export default abstract class ComponentBase<TProps, TState = {}> extends React.Component<TProps, TState> {
  public shouldComponentUpdate(nextProps: Readonly<TProps>, nextState: Readonly<TState>): boolean {
    return this.shouldComponentUpdateInternal(
      this.props as DeepReadonly<TProps>,
      nextProps as DeepReadonly<TProps>,
      this.state as DeepReadonly<TState>,
      nextState as DeepReadonly<TState>,
    );
  }

  protected abstract shouldComponentUpdateInternal(
    currentProps: DeepReadonly<TProps>,
    nextProps: DeepReadonly<TProps>,
    currentState: DeepReadonly<TState>,
    nextState: DeepReadonly<TState>,
  ): boolean;

  public render(): React.ReactElement {
    return this.renderInternal();
  }

  protected abstract renderInternal(): React.ReactElement;
}
