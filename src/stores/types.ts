export interface DataSet {
  id: string;
  name: string;
  fieldMappings: string[];
  sheetSource?: string;
  sheetApiKey?: string;
  data: any[];
}

export interface CardDesign {
  id: string;
  name: string;
  code: string;
}