import * as React from 'react';
import * as ReactRedux from 'react-redux';
import store from './store';
import { ControlPanel } from './controlPanel/ControlPanel';

export default class Index extends React.Component {
  public render(): React.ReactElement {
    return (
      <>
        <ReactRedux.Provider store={store.reduxStore}>
          <ControlPanel />
        </ReactRedux.Provider>
      </>
    );
  }
}
