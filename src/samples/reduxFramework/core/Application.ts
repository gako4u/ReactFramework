import * as CoreRedux from './redux';

export default class Application {
  public constructor() {
    this.store = new CoreRedux.Store("____DEFAULT_REDUX_ACTION_TYPE____");
  }

  public readonly store: CoreRedux.Store;
}
