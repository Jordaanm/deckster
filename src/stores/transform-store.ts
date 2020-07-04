import { Transform } from './types';
import { observable, decorate } from 'mobx';
import { EntityStore } from './entity-store';

export class TransformStore extends EntityStore<Transform> {

  public items: Transform[] = [];

  protected get _items(): Transform[] {
    return this.items;
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
  items: observable
});