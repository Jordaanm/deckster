import * as React from 'react';
import { useObserver } from 'mobx-react-lite';
import { H2, EditableText, Button, ControlGroup, InputGroup, ButtonGroup, Dialog, TagInput } from '@blueprintjs/core';
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
  return (row: number) => {
    let entry = dataSet.data[row][key];
    return (<EditableCell value={entry} />);
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
    const saveImport = (data: object[]|null) => { 
      if(data) { dataSet.data = data; }
      toggleDialog();
    }
    const fieldChange = (values: React.ReactNode[]) => {
      dataSet.fields = values.map(x => x?.toString() || '').filter(Boolean).map(x => x.replace(/[^\w]/g, ''));
      return true; 
    };

    return (
      <section className="row editor">
        <div className="f1 col">
          <div className="row">
            <H2><EditableText onChange={changeName} value={dataSet.name} /></H2>
            <ButtonGroup>
              <Button icon="delete" text="Remove this Design" onClick={remove} />
              <Button icon="import" text="Import Data" onClick={toggleDialog} />
            </ButtonGroup>
          </div>
          <div className="row">
            <TagInput 
              large={true}
              values={dataSet.fields}
              addOnBlur={true}
              addOnPaste={true}
              onChange={fieldChange}
              leftIcon="manually-entered-data"
            />
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
        <Dialog
          isOpen={dialogIsOpen}
          icon="import"
          title="Import From Google Sheets"
          className="dialog--wide"
          onClose={toggleDialog}
        >
          <ImportSheet closeFn={toggleDialog} save={saveImport} dataSet={dataSet} />
        </Dialog>
      </section>
    );
  });
}