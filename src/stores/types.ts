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

export type TxOpParam = string|number;

export interface TxStep {
  params: TxOpParam[]
  operation: TxOperation;
}

export enum TxType {
  STRING,
  NUMBER
}

export interface TxOperation {
  name: string,
  input: TxType,
  output: TxType,
  pipe(value: TxOpParam, params: (TxOpParam)[]): TxOpParam;
}