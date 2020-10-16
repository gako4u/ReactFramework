import * as React from 'react';
import * as ReactRouter from 'react-router-dom';

export default function Main(): React.ReactElement {
  return (
    <>
      <div style={{ backgroundColor: "black", color: "white", fontSize: "20px", width: "100%", height: "100%", overflowY: "auto" }}>
        <ReactRouter.BrowserRouter>
          <div style={{ display: "flex", alignItems: "stretch" }}>
            <div style={{ flexGrow: 0 }}>
              <Link to={"/"} />
              <Link to={"/test1"} />
              <Link to={"/test1?a=1"} />
              <Link to={"/test2"} />
              <Link to={"/test3"} />
              <Link to={"/test4"} />
              <Link to={"/test4/test4"} />
              <Link to={"/test22"} />
            </div>

            <div style={{ flexGrow: 1, marginLeft: "1em" }}>
              <ReactRouter.Switch>
                <Route path={"/"} exact={true} />

                <Route path={"/test1"} />

                <Route path={"/test2"} />

                <Route path={"/test(3|4)"}>
                  <Route path={"/test3"} />
                  <Route path={"/test4/test4"} />
                </Route>

                <Route path={"/test2*"} />
              </ReactRouter.Switch>
            </div>
          </div>
        </ReactRouter.BrowserRouter>
      </div>
    </>
  );
}

function Link(props: { to: string }): React.ReactElement {
  return (
    <div>
      <ReactRouter.Link to={props.to} style={{ color: "rgb(100, 100, 255)" }}>
        {props.to}
      </ReactRouter.Link>
    </div>
  );
}

function Route(props: { path: string, exact?: boolean, children?: React.ReactNode }): React.ReactElement {
  return (
    <ReactRouter.Route path={props.path} exact={props.exact}>
      <div>
        {props.path}
      </div>
      {props.children}
    </ReactRouter.Route>
  );
}
