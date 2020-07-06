import { Image } from './types';
import { EntityStore } from './entity-store';
import { observable, decorate } from 'mobx';

export class ImageStore extends EntityStore<Image> {

  public get label(): string {
    return "Images";
  }
  
  public get entityName(): string {
    return "images";
  }

  public createFromGuid(guid: string, fields: any): Image {
    return {
      id: guid,
      name: 'New Image',
      data: fields?.data || ''
    };
  }
}

decorate(ImageStore, {
  items: observable,
  currentlySelectedID: observable
});