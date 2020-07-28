interface FieldMappings {
  [key: string]: number
};

export interface IEntity {
  id: string;
  name: string;
}

export interface DataSet extends IEntity {
  fields: string[];
  fieldMappings: FieldMappings;
  sheetData: SheetData
  data: any[];
}

export interface CardDesign extends IEntity {
  code: string;
  styles: string;
}

export interface Transform extends IEntity {
  steps: TxStep[];
}

export interface Image extends IEntity {
  data: string;
}


export interface Render extends IEntity {
  fieldTransforms: FieldTransformIds[];
  dataSet: string|null;
  cardDesign: string|null;
  cardBackDesign: string|null;
}

export interface FieldTransformIds {
  field: string;
  transform: string;
}

export interface SheetData {
  source: string;
  apiKey: string;
  range: string;
}

export type TxValue = string|number;

export interface TxStep {
  id: string;
  params: string[];
  operation: TxOperation;
}

export enum TxType {
  STRING,
  NUMBER
}

export interface TxOperation {
  name: string;
  description?: string;
  input: TxType;
  output: TxType;
  paramNames: string[];
  pipe(value: TxValue, params: string[]): TxValue;
}