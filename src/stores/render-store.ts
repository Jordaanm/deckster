import { Render } from './types';
import { EntityStore } from './entity-store';
import { observable, decorate } from 'mobx';

export class RenderStore extends EntityStore<Render> {

  public get label(): string {
    return "Render Cards";
  }
  
  public get entityName(): string {
    return "Renders";
  }

  public createFromGuid(guid: string, fields: any): Render {
    return {
      id: guid,
      name: 'New Set of Cards',
      fieldTransforms: [],
      dataSet: null,
      cardDesign: null
    };
  }
}

decorate(RenderStore, {
  items: observable,
  currentlySelectedID: observable
});