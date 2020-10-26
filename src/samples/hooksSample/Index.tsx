import * as React from 'react';
import { ControlPanel } from './controlPanel/ControlPanel';

export default class Index extends React.Component {
  public render(): React.ReactElement {
    return (
      <>
        <ControlPanel />
      </>
    );
  }
}
