export interface FieldMapping {
  index: number,
  fieldName: string
}

export interface SheetData {
  source: string;
  apiKey: string;
  range: string;
}

export interface DataSet {
  id: string;
  name: string;
  fields: string[];
  fieldMappings: FieldMapping[];
  sheetData: SheetData
  data: any[];
}

export interface CardDesign {
  id: string;
  name: string;
  code: string;
}