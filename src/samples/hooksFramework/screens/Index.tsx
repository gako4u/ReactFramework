import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import * as History from 'history';
import IndexController from './IndexController';
import Application from './Application';

export default function Index(): React.ReactElement {
  const browserHistory = ReactRouter.useHistory();
  const [caption, setCaption] = React.useState("--");

  const indexController: IndexController = {
    setCaption: setCaption,
  };

  return (
    <>
      <div>
        {caption}
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 0, padding: "1em 4em 1em 1em" }}>
          <div>
            {
              Application.screens.select((item, idx) =>
                <React.Fragment key={idx}>
                  <div style={{ width: "100%", marginTop: idx === 0 ? "0px" : "1em" }}>
                    <ul>
                      <li>
                        <span style={{ display: "inline-block", verticalAlign: "top", width: "100%" }}>
                          <div>
                            {item.caption}
                          </div>
                          <div>
                            {item.path}
                          </div>
                          <div>
                            <ReactRouter.Link to={item.path}>
                              link
                            </ReactRouter.Link>
                          </div>
                          <div>
                            <button onClick={e => buttonOnClick(e, browserHistory, item.path)}>
                              button
                            </button>
                          </div>
                        </span>
                      </li>
                    </ul>
                  </div>
                </React.Fragment>
              ).toArray()
            }
          </div>
        </div>

        <div style={{ flexGrow: 1 }}>
          <ReactRouter.Switch>
            {Application.screens.toRoutes(indexController)}
          </ReactRouter.Switch>
        </div>
      </div>
    </>
  );
}

function buttonOnClick(e: unknown, browserHistory: History.History<unknown>, to: string): void {
  browserHistory.push(to);
}
