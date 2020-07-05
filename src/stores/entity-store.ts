import { nanoid } from 'nanoid';
import { toJS } from 'mobx';
import { IEntity } from './types';

export abstract class EntityStore<T extends IEntity> {
  
  public currentlySelectedID: string = "";
  public items: T[] = [];
  
  public abstract get entityName(): string;
  public abstract get label(): string;
  public abstract createFromGuid(guid: string, fields: any): T;
  
  public save(): any {
    const json = {
      current: toJS(this.currentlySelectedID),
      items: toJS(this.items)
    };
    return json;
  };

  public load(data: any): void {
    this.currentlySelectedID = data.current;
    this.items.push(...data.items);
  }

  public create(fields: any = {}): T {
    const guid = nanoid();
    return this.createFromGuid(guid, fields);
  }

  public remove(id: string) {
    const index = this.items.findIndex((x: IEntity) => x.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
  
  public add(item: T): void {
    this.items.push(item);
  }

  public addNew(setAsCurrent: boolean, fields: any = {}): T {
    const item = this.create(fields);
    this.add(item);
    if(setAsCurrent) {
      this.currentlySelectedID = item.id;
    }
    return item;
  }

  public find(id?: string): T|undefined {
    return this.items.find(x => x.id === id);
  }
  
  public get currentItem(): T|undefined {
    return this.items.find(x => x.id === this.currentlySelectedID);
  }
}