import { decorate, observable, toJS } from "mobx";
import { TxOperation, TxStep } from './types';
import { nanoid } from 'nanoid';
import { DesignStore } from './design-store';
import { DataSetStore } from './dataset-store';
import { TransformStore } from './transform-store';

export class Project {
  static LOCALSTORAGE_KEY = "project";
  
  name: string = "My Project";
  datasets: DataSetStore = new DataSetStore();
  designs: DesignStore = new DesignStore();
  transforms: TransformStore = new TransformStore();
  
  intervalId: number = -1;

  static loadFromLocalStorage(): Project {
    const project = new Project();

    const serialised = localStorage?.getItem(Project.LOCALSTORAGE_KEY);
    if(serialised) {
      try {
        const deserial = JSON.parse(serialised);
        
        project.name = deserial.name;
        project.designs.load(deserial.designs);
        project.datasets.load(deserial.datasets);
        project.transforms.load(deserial.transforms);
      } catch {
        console.error("Unable to load Project store from local storage");
      }
    }

    return project;
  }

  saveToLocalStorage(): void {
    const serialised = JSON.stringify({
      name: toJS(this.name),
      designs: this.designs.save(),
      data: this.datasets.save(),
      transforms: toJS(this.transforms)
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
  name: observable
});