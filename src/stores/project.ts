import { decorate, observable, toJS } from "mobx";
import { DataSet, CardDesign, Transform, TxOperation, TxStep } from './types';
import { nanoid } from 'nanoid';

export class Project {
  static LOCALSTORAGE_KEY = "project";
  
  data: DataSet[] = [];
  designs: CardDesign[] = [];
  transforms: Transform[] = [];
  name: string = "My Project";
  
  intervalId: number = -1;

  static loadFromLocalStorage(): Project {
    const project = new Project();

    const serialised = localStorage?.getItem(Project.LOCALSTORAGE_KEY);
    if(serialised) {
      try {
        const deserial = JSON.parse(serialised);
        
        project.name = deserial.name;
        project.designs = [ ...deserial.designs ];
        project.data = [ ...deserial.data ];
        project.transforms = [ ...deserial.transforms ];
      } catch {
        console.error("Unable to load Project store from local storage");
      }
    }

    return project;
  }

  saveToLocalStorage(): void {
    const serialised = JSON.stringify({
      name: toJS(this.name),
      designs: toJS(this.designs),
      data: toJS(this.data),
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

  getDataSet(id?: string) {
    return this.data.find(x => x.id === id);
  }

  getDesign(id?: string) {
    return this.designs.find(x => x.id === id);
  }

  getTransform(id?: string) {
    return this.transforms.find(x => x.id === id);
  }

  addNewDataSet() {
    const newDataSet: DataSet = {
      id: nanoid(),
      name: `New DataSet`,
      fields: ['count'],
      fieldMappings: {},
      data: [{count: 1}, {count:2}],
      sheetData: {
        apiKey: '',
        range: '',
        source: ''
      }
    }

    this.data.push(newDataSet);
    return newDataSet;
  }

  addNewDesign(code?: string) {
    const newDesign: CardDesign = {
      id: nanoid(),
      name: `New Design`,
      code: code || ''
    };

    this.designs.push(newDesign);
    return newDesign;
  }

  addNewTransform() {
    const newTransform: Transform = {
      id: nanoid(),
      name: 'New Transform',
      steps: []
    }

    this.transforms.push(newTransform);
    return newTransform;
  }

  removeDesign(id: string) {
    const index = this.designs.findIndex(x => x.id === id);
    if (index !== -1) {
      this.designs.splice(index, 1);
    }
  }

  removeDataSet(id: string) {
    const index = this.data.findIndex(x => x.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
  }

  removeTransform(id: string) {
    const index = this.transforms.findIndex(x => x.id === id);
    if (index !== -1) {
      this.transforms.splice(index, 1);
    }
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
  data: observable,
  designs: observable,
  transforms: observable,
  name: observable
});