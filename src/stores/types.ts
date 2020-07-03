interface FieldMappings {
  [key: string]: number
};

export interface SheetData {
  source: string;
  apiKey: string;
  range: string;
}

export interface DataSet {
  id: string;
  name: string;
  fields: string[];
  fieldMappings: FieldMappings;
  sheetData: SheetData
  data: any[];
}

export interface CardDesign {
  id: string;
  name: string;
  code: string;
}

export interface Transform {
  id: string;
  name: string;
  steps: TxStep[];
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