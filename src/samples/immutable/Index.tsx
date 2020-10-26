/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable padding-line-between-statements */

import * as React from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import Reducer from './Reducer';
import NumericUpDown from './NumericUpDown';
import { Button } from "samples/utilities/Button";
import { testAction } from './ImmutableActions';

const reducerKey1 = "reducerKey1";
const reducerKey2 = "reducerKey2";
const reducers = {
  [reducerKey1]: Reducer.create(createState1, reducerKey1),
  [reducerKey2]: Reducer.create(createState2, reducerKey2),
};

const reducer: (state: any, reduxAction: Reducer.ReduxAction<any>) => any = Redux.combineReducers(reducers);
const store = Redux.createStore(reducer);

export default function Index(props: Record<string, unknown>): React.ReactElement {
  return (
    <div>
      <Button onClick={testAction}>Action</Button>
      <ReactRedux.Provider store={store}>
        <div><div><Count1 /></div><NumericUpDown<State1> store={store} reducerKey={reducerKey1} countStateGetter={root => root.get("count")} /></div>
        <div><div><Count2 /></div><NumericUpDown<State2> store={store} reducerKey={reducerKey2} countStateGetter={root => root.get("count")} /></div>
      </ReactRedux.Provider>
    </div>
  );
}

const Count1 =
  ReactRedux.connect((state: { reducerKey1: State1 }) => ({ state: state[reducerKey1] }))(function (props: { state?: State1 }) {
    return <>{props.state?.count.value}</>;
  });

const Count2 =
  ReactRedux.connect((state: { reducerKey2: State2 }) => ({ state: state[reducerKey2] }))(function (props: { state?: State2 }) {
    return <>{props.state?.count.value}</>;
  });

interface State1 { count: NumericUpDown.State; }
function createState1(): State1 { return { count: NumericUpDown.createInitialState() }; }

interface State2 { count: NumericUpDown.State; }
function createState2(): State2 { return { count: NumericUpDown.createInitialState() }; }
