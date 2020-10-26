import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import * as History from 'history';
import Immutable from 'samples/utilities/Immutable';
import DeepReadonly from 'samples/utilities/DeepReadonly';
import Enumerable from 'samples/utilities/Enumerable';

namespace Core {
  const ScreenArgsContext = React.createContext<ScreenArgs<unknown>>(undefined as unknown as ScreenArgs<unknown>);

  export type ReactElement = React.ReactElement;

  export abstract class Screen<TState> {
    public constructor(
      public readonly path: string,
    ) {
      this.RootComponent = this.RootComponent.bind(this);
    }

    public abstract get caption(): string;

    protected abstract get initialStateCreator(): () => TState;

    private reducerFunction(state: TState, stateUpdater: StateUpdater<TState>): TState {
      return defaultReducerFunction(state, stateUpdater);
    }

    protected RootComponent(props: { parentController: unknown, screenInitializer: (screen: Screen<unknown>, parentController: unknown) => void }): ReactElement {
      const [state, dispatcher] = useReducer(this.reducerFunction.bind(this), this.initialStateCreator); // eslint-disable-line react-hooks/rules-of-hooks

      const screenArgs: ScreenArgs<TState> = {
        state: state as DeepReadonly<TState>,
        dispatcher: dispatcher,
        parentController: props.parentController,
      };

      const screenInitializer = React.useCallback(() => props.screenInitializer(this, props.parentController), []); // eslint-disable-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
      React.useEffect(screenInitializer, [screenInitializer]); // eslint-disable-line react-hooks/rules-of-hooks

      return (
        <>
          <ScreenArgsContext.Provider value={screenArgs}>
            <this.Component />
          </ScreenArgsContext.Provider>
        </>
      );
    }

    protected abstract get Component(): (props: ScreenComponentProps) => ReactElement;

    public toRoute(parentController: unknown, screenInitializer: (screen: Screen<unknown>, parentController: unknown) => void, path: string): React.ReactElement {
      return (
        <ReactRouter.Route key={path} path={path}>
          <this.RootComponent parentController={parentController} screenInitializer={screenInitializer} />
        </ReactRouter.Route>
      );
    }
  }

  interface ScreenArgs<TState> {
    readonly state: DeepReadonly<TState>;

    readonly dispatcher: Dispatcher<TState>;

    readonly parentController: unknown;
  }

  export interface ScreenComponentProps {
  }

  export abstract class ScreenCollection<TParentController> implements Iterable<Screen<unknown>> {
    private readonly items: Screen<unknown>[] = [];

    public [Symbol.iterator](): Iterator<Screen<unknown>> {
      return this.items[Symbol.iterator]();
    }

    public select<T>(selector: (value: Screen<unknown>, index: number) => T): Enumerable<T> {
      return Enumerable.from(this.items).select(selector);
    }

    protected abstract screenInitializer(screen: Screen<unknown>, parentController: TParentController): void;

    public toRoutes(parentController: TParentController): ReactElement[] {
      const screenInitializer = this.screenInitializer.bind(this) as (screen: Screen<unknown>, parentController: unknown) => void;
      return this.items.map(item => item.toRoute(parentController, screenInitializer, item.path));
    }

    protected add<T extends Screen<unknown>>(screen: T): T {
      this.items.push(screen);
      return screen;
    }
  }

  export function useReducer<TState>(initialStateCreator: () => TState): [TState, Dispatcher<TState>];
  export function useReducer<TState>(reducerFunction: (state: TState, stateUpdater: StateUpdater<TState>) => TState, initialStateCreator: () => TState): [TState, Dispatcher<TState>];
  export function useReducer<TState>(arg0: unknown, arg1?: () => TState): [TState, Dispatcher<TState>] {
    const reducerFunction = arg1 === undefined ? defaultReducerFunction : arg0 as (state: TState, stateUpdater: StateUpdater<TState>) => TState;
    const initialStateCreator = arg1 === undefined ? (arg0 as () => TState) : arg1;

    const [state, dispatch] = React.useReducer(reducerFunction, undefined, initialStateCreator);
    const dispatcher = new Dispatcher<TState>(dispatch, () => state);
    return [state, dispatcher];
  }

  export function useScreenDispatcher<TState>(): Dispatcher<TState> {
    const screenArgs = React.useContext(ScreenArgsContext) as ScreenArgs<TState>;
    const result = screenArgs.dispatcher;
    return result;
  }

  export function useScreenState<TState>(): DeepReadonly<TState> {
    const screenArgs = React.useContext(ScreenArgsContext) as ScreenArgs<TState>;
    const result = screenArgs.state;
    return result;
  }

  export function useParentController<TParentController>(): TParentController {
    const screenArgs = React.useContext(ScreenArgsContext);
    const result = screenArgs.parentController as TParentController;
    return result;
  }

  export function useBrowserHistory(): BrowserHistory {
    const history = ReactRouter.useHistory();
    return new BrowserHistory(history);
  }

  function defaultReducerFunction<TState>(state: TState, stateUpdater: StateUpdater<TState>): TState {
    const immutable = Immutable.create(() => state, newObject => state = newObject);
    stateUpdater(immutable);
    return state;
  }

  interface StateUpdater<TState> {
    (stateDraft: Immutable<TState>): void;
  }

  export class Dispatcher<TState> {
    public constructor(
      private readonly dispatch: React.Dispatch<StateUpdater<TState>>,

      private readonly stateGetter: () => TState,
    ) {
    }

    public getState(): TState {
      return this.stateGetter();
    }

    public updateState(stateUpdater: StateUpdater<TState>): void {
      this.dispatch(stateUpdater);
    }

    public updateStateAsync(stateUpdater: StateUpdater<TState>): Promise<TState> {
      return new Promise<TState>((resolve, reject) => {
        try {
          this.updateState(stateUpdater);
          resolve(this.getState());
        } catch (error) {
          reject(error);
        }
      });
    }
  }

  export class BrowserHistory {
    public constructor(
      private readonly browserHistory: History.History<unknown>,
    ) {
    }

    public moveToScreen(nextScreen: Core.Screen<unknown>): void;
    public moveToScreen(nextScreen: Core.Screen<unknown>, locationState: History.LocationState): void;
    public moveToScreen(nextScreen: Core.Screen<unknown>, locationState?: History.LocationState): void {
      this.browserHistory.push(nextScreen.path, locationState);
    }
  }
}

export default Core;
