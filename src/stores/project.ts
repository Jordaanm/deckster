import { decorate, observable, toJS } from "mobx";
import { TxOperation, TxStep, IEntity } from './types';
import { nanoid } from 'nanoid';
import { DesignStore } from './design-store';
import { DataSetStore } from './dataset-store';
import { TransformStore } from './transform-store';
import { EntityStore } from './entity-store';
import { ImageStore } from "./image-store";
import { RenderStore } from './render-store';

export class Project {
  static LOCALSTORAGE_KEY = "project";
  
  name: string = "My Project";
  currentSection?: string;
  enableAutosave: boolean = false;

  datasets: DataSetStore = new DataSetStore();
  designs: DesignStore = new DesignStore();
  images: ImageStore = new ImageStore();
  transforms: TransformStore = new TransformStore();
  renders: RenderStore = new RenderStore();
  
  intervalId: number = -1;

  static loadFromJson(deserial: any): Project {
    const project = new Project();
    console.log("LOADING JSON", deserial);

    try {
      project.name = deserial.name;
      project.currentSection = deserial.currentSection;
      project.enableAutosave = deserial.enableAutosave;

      project.datasets.load(deserial.datasets);
      project.designs.load(deserial.designs);
      project.images.load(deserial.images);
      project.transforms.load(deserial.transforms);
      project.renders.load(deserial.renders);
    } catch(e) {
      console.error("Unable to load project from JSON", e);
    }

    return project;
  }

  static loadFromLocalStorage(): Project {
    const serialised = localStorage?.getItem(Project.LOCALSTORAGE_KEY);
    if(serialised !== null) {
      try {
        const deserial = JSON.parse(serialised);
        return Project.loadFromJson(deserial);
      } catch {
        console.error("Unable to load Project store from local storage");
      }
    }
    return new Project();
  }

  public loadFromProject(project: Project) {
    this.name = project.name;
    this.currentSection = project.currentSection;
    this.enableAutosave = project.enableAutosave;

    this.datasets = project.datasets;
    this.designs = project.designs;
    this.images = project.images;
    this.transforms = project.transforms;
    this.renders = project.renders;
  };

  getStore<T extends IEntity>(type: any): EntityStore<T>|null {
    const key = type?.entityID ? type.entityID() : null;
    const store = (this as any)[key];
    if(typeof store !== undefined) {
      return store;
    } else {
      return null;
    }
  }
  
  serialise(): string {
    const serialised = JSON.stringify({
      name: toJS(this.name),
      currentSection: toJS(this.currentSection),
      enableAutosave: toJS(this.enableAutosave),

      datasets: this.datasets.save(),
      designs: this.designs.save(),
      images: this.images.save(),
      transforms: this.transforms.save(),
      renders: this.renders.save()
    });

    return serialised;
  }

  saveToLocalStorage(): void {
    const serialised = this.serialise();
    
    console.log("Saving to LocalStorage", serialised, this);
    localStorage?.setItem(Project.LOCALSTORAGE_KEY, serialised);
  }

  runAutosave() {
    if(this.enableAutosave) {
      this.saveToLocalStorage();
    }
  }

  autoSave(period: number = 15000): void {
    if(this.intervalId !== -1) { clearInterval(this.intervalId); }
    this.intervalId = window.setInterval(() => this.runAutosave(), period);
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
  currentSection: observable,
  enableAutosave: observable
});