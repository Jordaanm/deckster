import * as React from 'react';
import { useObserver } from 'mobx-react-lite';
import { H2, ButtonGroup, Button, InputGroup, Card, Classes } from '@blueprintjs/core';
import { DataSet, SheetData } from '../stores/types';
import CodeMirror from 'react-codemirror';

interface ImportSheetProps {
  closeFn: () => void;
  save: () => void;
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

export const ImportSheet: React.FC<ImportSheetProps> = (props) => {

  const [importedData, setImportedData] = React.useState(null);

  return useObserver(() => {
    const {dataSet} = props;

    const updateField = (key: SheetDataKey) => (e: any) => { dataSet.sheetData[key] = e.target.value; };
    const {sheetData} = dataSet;
    return (
      <Card className="col">
        <H2>Import Data</H2>
        <div className={Classes.DIALOG_BODY}>
          <ButtonGroup vertical={true} fill={true}> 
            <Button text="Edit Field Mappings" icon="code" />
            <InputGroup placeholder="Google Sheet ID" leftIcon="id-number" value={sheetData.source} onChange={updateField('source')} />
            <InputGroup placeholder="Google API Key"  leftIcon="key"  value={sheetData.apiKey} onChange={updateField('apiKey')} />
            <InputGroup placeholder="Sheet Range (eg Sheet1!A1:C40)" leftIcon="manually-entered-data" value={sheetData.range} onChange={updateField('range')} />
            <Button text="Fetch Data" icon="download" onClick={() => fetchData(sheetData, setImportedData)} />
          </ButtonGroup>
          {importedData && <div>
            <CodeMirror value={JSON.stringify(importedData, null, 2)} />
          </div>}
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={props.save} icon="saved" text="Save" />
          </div>
        </div>
      </Card>
    );
  });
};