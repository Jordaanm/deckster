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