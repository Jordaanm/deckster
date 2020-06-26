import * as React from 'react';
import { useObserver } from 'mobx-react-lite';
import { H2, EditableText, Button, ControlGroup, InputGroup, Overlay, ButtonGroup, Card, Dialog } from '@blueprintjs/core';
import { Table, Column, EditableCell} from '@blueprintjs/table';
import { DataSet } from '../stores/types';
import { IStores } from '../stores/index';
import { useStores } from '../stores/util';
import { ImportSheet } from './import-sheet';
interface DataSetEditorProps {
  dataSet?: DataSet;
};

const getKeys = (dataSet: DataSet): string[] => {
  const keys = new Set<string>();

  dataSet.data.forEach(datum => {
    let k = Object.keys(datum);
    k.forEach(x => keys.add(x));
  });

  console.log("Columns: ", keys);
  return Array.from(keys);
}

const getCellRenderer = (dataSet: DataSet, key: string) => {
  console.log("GetCellRenderer", dataSet.data, key);
  return (row: number) => {
    let entry = dataSet.data[row][key];
    console.log("Entry", entry, dataSet.data, row, key);
    return (<EditableCell>{entry}</EditableCell>);
  };
}

const generateColumns = (dataSet: DataSet) => {
  const keys = getKeys(dataSet);
  return keys.map(key => {
    return (<Column key={key} name={key} cellRenderer={getCellRenderer(dataSet, key)} />);
  });
}

export const DataSetEditor: React.FC<DataSetEditorProps> = (props) => {

  const stores: IStores = useStores();
  const { project } = stores;

  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  const toggleDialog = () => setDialogIsOpen(!dialogIsOpen);

  return useObserver(() => {
    const { dataSet } = props;

    if (!dataSet) { return null; }
    
    const changeName = (text: string) => { if(dataSet) { dataSet.name = text; }};
    const remove = () => project.removeDataSet(dataSet.id);
    const saveImport = () => toggleDialog();

    return (
      <section className="row editor">
        <div className="f1 col">
          <div className="row">
            <H2><EditableText onEdit={changeName} value={dataSet.name} /></H2>
            <ButtonGroup>
              <Button icon="delete" text="Remove this Design" onClick={remove} />
              <Button icon="import" text="Import Data" onClick={toggleDialog} />
            </ButtonGroup>
          </div>
          <div className="row">
            Field Mappings
          </div>
          <div className="row">
            <ControlGroup>
              <Button text="Edit Field Mappings" icon="code" />
              <InputGroup placeholder="Google Sheet ID" leftIcon="id-number" />
              <InputGroup placeholder="Google API Key"  leftIcon="key" />
              <Button text="Fetch Data" icon="download" />
            </ControlGroup>
          </div>
          <div className="row">
            <Table
              enableColumnReordering={true}
              enableColumnResizing={false}
              enableRowReordering={true}
              enableRowResizing={false}
              numRows={dataSet.data.length}
            >
              {generateColumns(dataSet)}
            </Table>
          </div>
        </div>
        <Dialog isOpen={dialogIsOpen} icon="import" title="Import From Google Sheets" onClose={toggleDialog}>
          <ImportSheet closeFn={toggleDialog} save={saveImport} dataSet={dataSet} />
        </Dialog>
      </section>
    );
  });
}