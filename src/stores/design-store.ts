import { CardDesign } from './types';
import { EntityStore } from './entity-store';
import { observable, decorate } from 'mobx';

export class DesignStore extends EntityStore<CardDesign> {

  public items: CardDesign[] = [];

  protected get _items(): CardDesign[] {
    return this.items;
  }
  public get entityName(): string {
    return "designs";
  }

  public createFromGuid(guid: string): CardDesign {
    return {
      id: guid,
      name: '',
      code: ''
    };
  }
}

decorate(DesignStore, {
  items: observable
});