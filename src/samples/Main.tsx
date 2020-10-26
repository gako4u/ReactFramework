/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import * as ReactRouter from 'react-router-dom';

namespace Main {
  class SubComponent {
    public constructor(public readonly name: string, factory: () => Promise<{ default: React.ComponentType<any> }>) {
      this.component = React.lazy(factory);
    }

    public readonly component: React.LazyExoticComponent<React.ComponentType<any>>;
  }

  export const subComponents: Record<string, SubComponent> = {
    Immutable: new SubComponent("Immutable", () => import('./immutable/Index')),
    ReduxSample: new SubComponent("ReduxSample", () => import('./reduxSample/Index')),
  };

  export function Component(): React.ReactElement {
    return (
      <>
        <div style={{ backgroundColor: "black", color: "white", width: "100%", height: "100%", overflowY: "auto" }}>
          <ReactRouter.BrowserRouter>
            <div style={{ display: "flex", alignItems: "stretch" }}>
              <div style={{ flexGrow: 0 }}>
                <div style={{ padding: "1em 4em 1em 1em" }}>
                  {enumerateMenuItems()}
                </div>
              </div>

              <div style={{ flexGrow: 1 }}>
                <ReactRouter.Switch>
                  {enumerateComponents()}
                </ReactRouter.Switch>
              </div>
            </div>
          </ReactRouter.BrowserRouter>
        </div>
      </>
    );
  }

  function enumerateMenuItems(): React.ReactElement[] {
    return Object.values(subComponents).map(
      (subComponent, idx) => (
        <React.Fragment key={idx}>
          <div style={{ width: "100%", marginTop: idx === 0 ? "0px" : "1em" }}>
            <ReactRouter.Link to={"/" + subComponent.name + "/"} style={{ display: "block", width: "100%" }}>
              {idx}: {subComponent.name}
            </ReactRouter.Link>
          </div>
        </React.Fragment>
      )
    );
  }

  function enumerateComponents(): React.ReactElement[] {
    return Object.values(subComponents).map(
      (subComponent, idx) => (
        <ReactRouter.Route key={idx} path={"/" + subComponent.name + "/"}>
          <React.Suspense fallback={<></>}>
            <div>
              <subComponent.component />
            </div>
          </React.Suspense>
        </ReactRouter.Route>
      )
    );
  }
}

export default Main;
