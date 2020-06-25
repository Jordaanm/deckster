import { decorate, observable } from "mobx";
import { DataSet, CardDesign } from './types';

export class Project {
  data: DataSet[] = [];
  datasetCount: number = 0;
  designs: CardDesign[] = [];
  designCount: number = 0;

  getDataSet(id?: number) {
    return this.data.find(x => x.id === id);
  }

  getDesign(id?: number) {
    return this.designs.find(x => x.id === id);
  }


  addNewDataSet() {
    this.datasetCount++;
    const newDataSet: DataSet = {
      id: this.datasetCount,
      name: `DataSet ${this.datasetCount}`,
      fieldMappings: [],
      data: []
    }

    this.data.push(newDataSet);
    return newDataSet;
  }

  addNewDesign(code?: string) {
    this.designCount ++;
    const newDesign: CardDesign = {
      id: this.designCount,
      name: `Design ${this.designCount}`,
      code: code || ''
    };

    this.designs.push(newDesign);
    return newDesign;
  }

  removeDesign(id: number) {
    const index = this.designs.findIndex(x => x.id === id);
    if (index !== -1) {
      this.designs.splice(index, 1);
    }
  }

  removeDataSet(id: number) {
    const index = this.data.findIndex(x => x.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
  }
}

decorate(Project, {
  data: observable,
  designs: observable,
  designCount: observable,
  datasetCount: observable
});