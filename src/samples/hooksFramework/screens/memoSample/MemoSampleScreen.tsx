import * as React from 'react';
import Core from '../../core/Core';
import IndexController from '../IndexController';
import { Button } from "samples/utilities/Button";
import MemoEx from 'samples/utilities/components/MemoEx';
import useMemoEx from 'samples/utilities/hooks/useMemoEx';

export default class MemoSampleScreen extends Core.Screen<undefined> {
  public get caption(): string {
    return "MemoSample";
  }

  protected get initialStateCreator(): () => undefined {
    return () => undefined;
  }

  protected get Component(): (props: Core.ScreenComponentProps) => Core.ReactElement {
    return Component;
  }
}

function Component(props: Core.ScreenComponentProps): Core.ReactElement {
  const [now, setNow] = React.useState(new Date());

  return (
    <>
      <div>
        <div>
          <Button onClick={event => setNow(new Date())}>Refresh</Button>
        </div>
        <div>
          <MyComponent now={now} />
        </div>
      </div>
    </>
  );
}

function MyComponent(props: { now: Date }): React.ReactElement {
  const nowValue = props.now.getTime() - props.now.getMilliseconds();
  const now = new Date(nowValue);

  const myComponent1 = React.useMemo(() => <MyComponent1 value={now} />, [nowValue]);    // eslint-disable-line react-hooks/exhaustive-deps
  const myComponent1_2 = useMemoEx(() => <MyComponent1 value={now} />, [now]);

  const pc = Core.useParentController<IndexController>();
  return (
    <>
      <div>
        {myComponent1}
      </div>
      <div>
        {myComponent1_2}
      </div>
      <div>
        <MemoEx deps={[now]}>
          <MyComponent1 value={now} />
        </MemoEx>
      </div>
      <div>
        <Button onClick={e => pc.setCaption(new Date().toString())}>now</Button>
      </div>
    </>
  );
}

function MyComponent1(props: { value: { toString: () => string } }): React.ReactElement {
  return (
    <>
      {numberValue(props.value)}
    </>
  );
}

function numberValue(value: { toString: () => string }): string {
  // eslint-disable-next-line no-console
  console.log(new Date());
  return value.toString();
}
