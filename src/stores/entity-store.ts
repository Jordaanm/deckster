import { nanoid } from 'nanoid';
import { toJS } from 'mobx';
import { IEntity } from './types';

export abstract class EntityStore<T extends IEntity> {
  
  protected currentlySelectedID: string = "";

  protected abstract get _items(): T[];

  public abstract get entityName(): string;
  public abstract createFromGuid(guid: string): T;
  
  
  public save(): any {
    const json = toJS(this._items);
    return json;
  };

  public load(data: any): void {
    this._items.push(...data.items);
  }

  public create(): T {
    const guid = nanoid();
    return this.createFromGuid(guid);
  }

  public remove(id: string) {
    const index = this._items.findIndex((x: IEntity) => x.id === id);
    if (index !== -1) {
      this._items.splice(index, 1);
    }
  }
  
  public add(item: T): void {
    this._items.push(item);
  }

  public addNew(): T {
    const item = this.create();
    this.add(item);
    return item;
  }

  public find(id?: string): T|undefined {
    return this._items.find(x => x.id === id);
  }
  
  public get currentItem(): T|undefined {
    return this._items.find(x => x.id === this.currentlySelectedID);
  }
}