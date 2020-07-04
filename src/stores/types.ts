interface FieldMappings {
  [key: string]: number
};

export interface IEntity {
  id: string;
}

export interface SheetData {
  source: string;
  apiKey: string;
  range: string;
}

export interface DataSet extends IEntity {
  name: string;
  fields: string[];
  fieldMappings: FieldMappings;
  sheetData: SheetData
  data: any[];
}

export interface CardDesign extends IEntity {
  name: string;
  code: string;
}

export interface Transform extends IEntity {
  name: string;
  steps: TxStep[];
}

export type TxValue = string|number;

export interface TxStep extends IEntity {
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