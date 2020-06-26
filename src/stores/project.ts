import { decorate, observable } from "mobx";
import { DataSet, CardDesign } from './types';
import { nanoid } from 'nanoid';

export class Project {
  data: DataSet[] = [];
  designs: CardDesign[] = [];

  getDataSet(id?: string) {
    return this.data.find(x => x.id === id);
  }

  getDesign(id?: string) {
    return this.designs.find(x => x.id === id);
  }


  addNewDataSet() {
    const newDataSet: DataSet = {
      id: nanoid(),
      name: `New DataSet`,
      fields: ['count'],
      fieldMappings: [],
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
}

decorate(Project, {
  data: observable,
  designs: observable
});