export interface DataSet {
  id: number;
  name: string;
  fieldMappings: string[];
  data: any[];
}

export interface CardDesign {
  id: number;
  name: string;
  code: string;
}