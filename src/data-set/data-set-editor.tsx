import * as React from 'react';
import { DataSet } from '../stores/types';
import { useObserver } from 'mobx-react-lite';
import { H2, EditableText, Button } from '@blueprintjs/core';
import { IStores } from '../stores/index';
import { useStores } from '../stores/util';

interface DataSetEditorProps {
  dataSet?: DataSet;
};

export const DataSetEditor: React.FC<DataSetEditorProps> = (props) => {

  const stores: IStores = useStores();
  const { project } = stores;

  return useObserver(() => {
    const { dataSet } = props;

    if (!dataSet) { return null; }
    
    const changeName = (text: string) => { if(dataSet) { dataSet.name = text; }};

    const remove = () => {
      project.removeDataSet(dataSet.id);      
    }

    return (
      <section className="row editor">
        <div className="f1 col">
          <div className="row">
            <H2><EditableText onEdit={changeName} value={dataSet.name} /></H2>
            <Button icon="delete" text="Remove this Design" onClick={remove}/>
          </div>
        </div>
      </section>
    );
  });
}