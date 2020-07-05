import { Project } from './project';

export interface IStores {
  project: Project
}

export const Stores: IStores = {
  project: Project.loadFromLocalStorage()
};

(window as any)['stores'] = Stores;