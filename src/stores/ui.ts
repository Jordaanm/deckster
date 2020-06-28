import { decorate, observable } from 'mobx';

export class UiStore {
  currentSection: string = 'design';
  currentDesign?: string = undefined;
  currentDataset?: string = undefined;
  currentTransform?: string = undefined;
}

decorate(UiStore, {
  currentSection: observable,
  currentDataset: observable,
  currentDesign: observable,
  currentTransform: observable
});