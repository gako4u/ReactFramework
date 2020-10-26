import * as React from 'react';
import * as ReactRedux from 'react-redux';
import application from './application';
import { ControlPanel } from './controlPanel/ControlPanel';

export default class Index extends React.Component {
  public render(): React.ReactElement {
    return (
      <>
        <ReactRedux.Provider store={application.store.reduxStore}>
          <ControlPanel />
        </ReactRedux.Provider>
      </>
    );
  }
}
