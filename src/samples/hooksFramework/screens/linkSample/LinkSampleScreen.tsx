import * as React from 'react';
import Core from 'samples/hooksFramework/core/Core';
import Application from '../Application';

export default class LinkSampleScreen extends Core.Screen<unknown> {
  public constructor(
    path: string,
    public readonly caption: string,
  ) {
    super(path);
  }

  protected get initialStateCreator(): () => unknown {
    return () => { };
  }

  protected get Component(): (props: Core.ScreenComponentProps) => Core.ReactElement {
    return Component;
  }
}

function Component(props: Core.ScreenComponentProps): Core.ReactElement {
  const browserHistory = Core.useBrowserHistory();

  return (
    <>
      {
        [Application.screens.linkSample1, Application.screens.linkSample2].map(
          screen => (
            <div key={screen.path} style={{ marginTop: "10px" }}>
              <button onClick={e => onClick(browserHistory, screen)}>
                {screen.caption}
              </button>
            </div>
          )
        )
      }
    </>
  );
}

function onClick(browserHistory: Core.BrowserHistory, screen: Core.Screen<unknown>): void {
  browserHistory.moveToScreen(screen);
}
