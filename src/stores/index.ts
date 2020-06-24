import { UiStore } from './ui';
import { Project } from './project';

export interface IStores {
  ui: UiStore,
  project: Project
}

export const Stores: IStores = {
  ui: new UiStore(),
  project: new Project()
};

(window as any)['stores'] = Stores;