import * as React from "react";
import Core from "samples/hooksFramework/core/Core";
import CommonDialogSampleScreenState from "./CommonDialogSampleScreenState";
import NumericUpDown from "./NumericUpDown";

export default class CommonDialogSampleScreen extends Core.Screen<CommonDialogSampleScreenState> {
  public get caption(): string {
    return "Common Dialog Sample";
  }

  protected get initialStateCreator(): () => CommonDialogSampleScreenState {
    return CommonDialogSampleScreenState.create;
  }

  protected get Component(): (props: Core.ScreenComponentProps) => Core.ReactElement {
    return Component;
  }
}

function Component(props: Core.ScreenComponentProps): Core.ReactElement {
  const state = Core.useScreenState<CommonDialogSampleScreenState>();

  return (
    <>
      <div>
        count1: <NumericUpDown state={state} stateSelector={draftState => draftState.get("count1")} />
      </div>
      <div>
        count2: <NumericUpDown state={state} stateSelector={draftState => draftState.get("count2")} />
      </div>
    </>
  );
}
