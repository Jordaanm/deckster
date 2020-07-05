import { DataSet } from './types';
import { EntityStore } from './entity-store';
import { observable, decorate } from 'mobx';

export class DataSetStore extends EntityStore<DataSet> {

  public get label(): string {
    return "Data Sets";
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
  items: observable,
  currentlySelectedID: observable
});