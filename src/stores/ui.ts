import { decorate, observable } from 'mobx';

export class UiStore {
  currentSection: string = 'design';
  currentDesign?: number = undefined;
  currentDataset?: number = undefined;
}

decorate(UiStore, {
  currentSection: observable,
  currentDataset: observable,
  currentDesign: observable
});