/* eslint-disable no-console */
/* eslint-disable padding-line-between-statements */

import Immutable from '../utilities/Immutable';

export function testAction(): void {
  const state0 = { root: createState() };
  let state1 = state0;
  const state1Map = Immutable.create(() => state1, newObj => state1 = newObj);
  const state1root = state1Map.get("root");
  const state1level1 = state1root.get("level1");
  const state1level2 = state1level1.get("level2");
  console.log(state1level2.get("value1").value);
  console.log(state1level2.get("value2").value);
  console.log(state1level2.get("value3").get(1).value);

  const node0_1 = state1;
  const node1_1 = state1.root;
  const node2_1 = state1.root.level1;
  const node3_1 = state1.root.level1.level2;

  state1level2.get("value3").get(1).value = "_";
  console.log(state1level2.get("value1").value);

  const node0_2 = state1;
  const node1_2 = state1.root;
  const node2_2 = state1.root.level1;
  const node3_2 = state1.root.level1.level2;
  console.log((node0_1 === node0_2) === false);
  console.log((node1_1 === node1_2) === false);
  console.log((node2_1 === node2_2) === false);
  console.log((node3_1 === node3_2) === false);

  console.log(state0);
  console.log(state1);
}

interface State { level1: Level1 }
function createState(): State { return { level1: createLevel1() }; }

interface Level1 { level2: Level2; }
function createLevel1(): Level1 { return { level2: createLevel2() }; }

interface Level2 { value1: number; value2: string, value3: string[] }
function createLevel2(): Level2 { return { value1: 0, value2: "A", value3: ["a", "b", "c"] }; }
