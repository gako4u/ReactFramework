import * as React from 'react';
import * as ReactRedux from 'react-redux';
import StoreBuilder from "./StoreBuilder";
import CounterWithMapStateToProps from './CounterWithMapStateToProps';
import CounterWithMapDispatchToProps from './CounterWithMapDispatchToProps';

const store = StoreBuilder.createStore();

export default function Index(props: {}): React.ReactElement {
  return (
    <>
      <ReactRedux.Provider store={store}>
        <CounterWithMapStateToProps />
      </ReactRedux.Provider>

      <ReactRedux.Provider store={store}>
        <CounterWithMapDispatchToProps />
      </ReactRedux.Provider>
    </>
  );
}
