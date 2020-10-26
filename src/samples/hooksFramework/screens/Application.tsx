/* eslint sort-imports: ["error", { "allowSeparatedGroups": true }] */
import Core from '../core/Core';

import Main from 'samples/Main';

import IndexController from './IndexController';

import CommonDialogSampleScreen from './commonDialogSample/CommonDialogSampleScreen';
import ControlPanelScreen from './controlPanel/ControlPanelScreen';
import LinkSampleScreen from './linkSample/LinkSampleScreen';
import MemoSampleScreen from './memoSample/MemoSampleScreen';

namespace Application {
  export function useDispatcher<TState>(): Core.Dispatcher<TState> {
    return Core.useScreenDispatcher<TState>();
  }

  class ScreensCollection extends Core.ScreenCollection<IndexController> {
    public readonly commonDialogSample = this.add(new CommonDialogSampleScreen(this.createPath("CommonDialogSample")));

    public readonly controlPanel = this.add(new ControlPanelScreen(this.createPath("ControlPanel")));

    public readonly memoSample = this.add(new MemoSampleScreen(this.createPath("MemoSample")));

    public readonly linkSample1 = this.add(new LinkSampleScreen(this.createPath("LinkSample1"), "Link Sample 1"));

    public readonly linkSample2 = this.add(new LinkSampleScreen(this.createPath("LinkSample2"), "Link Sample 2"));

    protected screenInitializer(screen: Core.Screen<unknown>, parentController: IndexController): void {
      parentController.setCaption(screen.caption);
    }

    private createPath(name: string): string {
      return `/${Main.subComponents.HooksFramework.name}/${name}`;
    }
  }

  export const screens = new ScreensCollection();
}

export default Application;
