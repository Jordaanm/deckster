import { Transform } from './types';
import { observable, decorate } from 'mobx';
import { EntityStore } from './entity-store';

export class TransformStore extends EntityStore<Transform> {

  public get label(): string {
    return "Transforms";
  }
  
  public get entityName(): string {
    return "transforms";
  }

  public createFromGuid(guid: string): Transform {
    return {
      id: guid,
      name: 'New Transform',
      steps: []
    };
  }
}

decorate(TransformStore, {
  items: observable,
  currentlySelectedID: observable
});