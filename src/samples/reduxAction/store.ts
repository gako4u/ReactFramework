import * as Core from './core';
import RootState from "./RootState";

const store = new Core.Store(RootState.createInitial);

export default store;
