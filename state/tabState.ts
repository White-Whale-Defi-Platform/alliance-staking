import { atom } from 'recoil';

export enum TabType { dashboard = 'dashboard', alliance = 'alliance', ecosystem = 'restaking' }

export const tabState = atom<TabType>({
  key: 'tabState',
  default: TabType.dashboard,
});
