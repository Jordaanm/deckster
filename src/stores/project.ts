import { decorate, observable, toJS } from "mobx";
import { TxOperation, TxStep, IEntity } from './types';
import { nanoid } from 'nanoid';
import { DesignStore } from './design-store';
import { DataSetStore } from './dataset-store';
import { TransformStore } from './transform-store';
import { EntityStore } from './entity-store';
import { ImageStore } from "./image-store";
import { RenderStore } from './render-store';
import { fileLoader } from './util';
import FileSaver from 'file-saver';

export class Project {
  static LOCALSTORAGE_KEY = "project";
  
  name: string = "My Project";
  currentSection?: string;
  enableAutosave: boolean = false;
  autosavePeriod: number = 15;

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
      project.autosavePeriod = deserial.autosavePeriod;

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

  public importFile() {
    let project = this;
    let $input = document.createElement('input');
    $input.type = 'file';
    $input.onchange = fileLoader((result: string|ArrayBuffer|null) => {
      const data = result?.toString();
      if(data) {
        const json = JSON.parse(atob(data.substr(29)));
        const newProject: Project = Project.loadFromJson(json);
        project.loadFromProject(newProject);
      }
    });

    $input.click();
  }

  public exportToFile() {
    var json = this.serialise();
    var blob = new Blob([json], {type: 'application/json;charset=utf-8'});

    FileSaver.saveAs(blob, 'project.json');
  }

  public toggleAutosave(): boolean {
    const val = !this.enableAutosave
    this.enableAutosave = val;
    return val;
  }

  public loadFromProject(project: Project) {
    this.name = project.name;
    this.currentSection = project.currentSection;
    this.enableAutosave = project.enableAutosave;
    this.autosavePeriod = project.autosavePeriod;

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
      autosavePeriod: toJS(this.autosavePeriod),

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

  private runAutosave() {
    if(this.enableAutosave) {
      this.saveToLocalStorage();
    }
  }

  private getPeriodBase(): number {
    let periodBase = this.autosavePeriod;
    if(typeof periodBase !== 'number' || periodBase < 15) {
      periodBase = 15;
    }

    return periodBase;
  }

  updateAutosavePeriod(period: number|string) {
    const periodNumber = Number(period);
    if(periodNumber >= 15) {
      this.autosavePeriod = periodNumber;
      this.autoSave();
    }
  }

  autoSave(): void {
    const periodBase = this.getPeriodBase();
    const period = periodBase * 1000;

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
  enableAutosave: observable,
  autosavePeriod: observable
});