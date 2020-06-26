import * as React from 'react';
import { useObserver } from 'mobx-react-lite';
import { H2, ButtonGroup, Button, InputGroup, Card, Classes, H3 } from '@blueprintjs/core';
import { DataSet, SheetData } from '../stores/types';
import CodeMirror from 'react-codemirror';
import { Table, Column, EditableCell } from '@blueprintjs/table';

interface ImportSheetProps {
  closeFn: () => void;
  save: (data: object[]|null) => void;
  dataSet: DataSet;
}

type SheetDataKey = keyof SheetData;

const fetchData = (sheet: SheetData, save: (data: any) => void) => {
  const {source, range, apiKey} = sheet;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${source}/values/${range}?key=${apiKey}`;
  fetch(url)
    .then(x => x.json())
    .then(data => {
      save(data);
    });
};

const handleMappingChange = (dataSet: DataSet, field: string) => (value: string) => {
  const parsed = parseInt(value, 10);
  dataSet.fieldMappings[field] = typeof parsed == 'number' ? parsed : -1;
};

const getCellRenderer = (dataSet: DataSet, field: string) => {
  return (row: number) => {
    let entry = dataSet.fieldMappings[field] || -1;
    return (<EditableCell onChange={handleMappingChange(dataSet, field)}>{entry}</EditableCell>);
  };
}

const generateColumns = (dataSet: DataSet) => {
  return dataSet.fields.map(field => {
    return (<Column key={field} name={field} cellRenderer={getCellRenderer(dataSet, field)} />);
  })
}

export const ImportSheet: React.FC<ImportSheetProps> = (props) => {

  const [importedData, setImportedData] = React.useState<object|null>(null);
  const [txData, setTxData] = React.useState<object[]|null>(null);

  return useObserver(() => {
    const {dataSet} = props;
    const {sheetData, fieldMappings} = dataSet;

    const updateField = (key: SheetDataKey) => (e: any) => { dataSet.sheetData[key] = e.target.value; };
    const transformData = () => {
      if(!importedData) { return; }

      const tx = (importedData as any).values.map((values: string[]) => {
        return (dataSet.fields).reduce((obj: any, key: string) => {
          const index = fieldMappings[key];
          obj[key] = values[index] || '';

          return obj;
        }, {});
      });

      setTxData(tx);
    };

    return (
      <Card className="col">
        <H2>Import Data</H2>
        <div className={Classes.DIALOG_BODY}>
          <ButtonGroup vertical={true} fill={true}> 
            <InputGroup placeholder="Google Sheet ID" leftIcon="id-number" value={sheetData.source} onChange={updateField('source')} />
            <InputGroup placeholder="Google API Key"  leftIcon="key"  value={sheetData.apiKey} onChange={updateField('apiKey')} />
            <InputGroup placeholder="Sheet Range (eg Sheet1!A1:C40)" leftIcon="manually-entered-data" value={sheetData.range} onChange={updateField('range')} />
            <Button text="Fetch Data" icon="download" onClick={() => fetchData(sheetData, setImportedData)} />
          </ButtonGroup>
          {importedData && <div>
            <CodeMirror value={JSON.stringify(importedData, null, 2)} />
            <H3>Field Mappings</H3>
            <Table numRows={1}>
              {generateColumns(dataSet)}
            </Table>
            <Button icon="translate" onClick={transformData}>Transform Data</Button>
          </div>}
          {txData && <div>
            <CodeMirror value={JSON.stringify(txData, null, 2)} />
          </div>}

        </div>
        {txData && <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => props.save(txData)} icon="saved" text="Save" />
          </div>
        </div>}
      </Card>
    );
  });
};