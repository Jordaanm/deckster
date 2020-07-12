import { GenerateConfig } from './types';
import { EntityStore } from './entity-store';
import { observable, decorate } from 'mobx';

export class GenerateConfigStore extends EntityStore<GenerateConfig> {

  public get label(): string {
    return "Generate Cards";
  }
  
  public get entityName(): string {
    return "GenerateConfigs";
  }

  public createFromGuid(guid: string, fields: any): GenerateConfig {
    return {
      id: guid,
      name: 'New Set of Cards',
      fieldTransforms: [],
      dataSet: null,
      cardDesign: null
    };
  }
}

decorate(GenerateConfigStore, {
  items: observable,
  currentlySelectedID: observable
});