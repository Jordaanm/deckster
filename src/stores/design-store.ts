import { CardDesign } from './types';
import { EntityStore } from './entity-store';
import { observable, decorate } from 'mobx';

export class DesignStore extends EntityStore<CardDesign> {

  public get label(): string {
    return "Card Designs";
  }
  
  public get entityName(): string {
    return "designs";
  }

  public createFromGuid(guid: string, fields: any): CardDesign {
    return {
      id: guid,
      name: 'New Design',
      code: fields?.code || '',
      styles: fields?.styles || ''
    };
  }
}

decorate(DesignStore, {
  items: observable,
  currentlySelectedID: observable
});