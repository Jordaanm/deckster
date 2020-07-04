import { DataSet } from './types';
import { EntityStore } from './entity-store';
import { observable, decorate } from 'mobx';

export class DataSetStore extends EntityStore<DataSet> {

  public items: DataSet[] = [];

  protected get _items(): DataSet[] {
    return this.items;
  }
  public get entityName(): string {
    return "datasets";
  }

  public createFromGuid(guid: string): DataSet {
    return {
      id: guid,
      name: 'New Dataset',
      fields: ['count'],
      fieldMappings: {},
      data: [{count: 1}, {count:2}],
      sheetData: {
        apiKey: '',
        range: '',
        source: ''
      }      
    };
  }
}

decorate(DataSetStore, {
  items: observable
});