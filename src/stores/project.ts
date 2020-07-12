import { decorate, observable, toJS } from "mobx";
import { TxOperation, TxStep, IEntity } from './types';
import { nanoid } from 'nanoid';
import { DesignStore } from './design-store';
import { DataSetStore } from './dataset-store';
import { TransformStore } from './transform-store';
import { EntityStore } from './entity-store';
import { ImageStore } from "./image-store";
import { GenerateConfigStore } from './generate-config-store';

export class Project {
  static LOCALSTORAGE_KEY = "project";
  
  name: string = "My Project";
  currentSection?: string;

  datasets: DataSetStore = new DataSetStore();
  designs: DesignStore = new DesignStore();
  images: ImageStore = new ImageStore();
  transforms: TransformStore = new TransformStore();
  generateConfigs: GenerateConfigStore = new GenerateConfigStore();
  
  intervalId: number = -1;

  static loadFromLocalStorage(): Project {
    const project = new Project();

    const serialised = localStorage?.getItem(Project.LOCALSTORAGE_KEY);
    if(serialised) {
      try {
        const deserial = JSON.parse(serialised);
        
        project.name = deserial.name;
        project.currentSection = deserial.currentSection;
        project.datasets.load(deserial.datasets);
        project.designs.load(deserial.designs);
        project.images.load(deserial.images);
        project.transforms.load(deserial.transforms);
        project.generateConfigs.load(deserial.generateConfigs);
      } catch {
        console.error("Unable to load Project store from local storage");
      }
    }

    return project;
  }

  getStore<T extends IEntity>(type: any): EntityStore<T>|null {
    const key = type?.entityID ? type.entityID() : null;
    const store = (this as any)[key];
    if(typeof store !== undefined) {
      return store;
    } else {
      return null;
    }
  }

  saveToLocalStorage(): void {
    const serialised = JSON.stringify({
      name: toJS(this.name),
      currentSection: toJS(this.currentSection),
      datasets: this.datasets.save(),
      designs: this.designs.save(),
      images: this.images.save(),
      transforms: this.transforms.save(),
      generateConfigs: this.generateConfigs.save()
    });
    
    console.log("Saving to LocalStorage", serialised, this);
    localStorage?.setItem(Project.LOCALSTORAGE_KEY, serialised);
  }

  autoSave(period: number = 15000): void {
    if(this.intervalId !== -1) { clearInterval(this.intervalId); }
    this.saveToLocalStorage();
    this.intervalId = window.setInterval(() => this.saveToLocalStorage(), period);
  } 

  createStep(fields: { params: string[]; operation: TxOperation; }): TxStep {
    const { params, operation } = fields;

    return {
      id: nanoid(),
      operation,
      params
    } as TxStep;
  }
}

decorate(Project, {
  name: observable,
  currentSection: observable
});