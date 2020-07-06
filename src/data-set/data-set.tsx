import * as React from 'react';
import { useObserver} from 'mobx-react-lite';
import { useStores } from '../stores/util';
import { IStores } from '../stores/index';
import { H1, ControlGroup, Button } from '@blueprintjs/core';
import { Project } from '../stores/project';
import { DataSetEditor } from './data-set-editor';

import { entitySelect } from '../app/entity-select';

export const DataSets: React.FC = () => {
  const stores: IStores = useStores();
  
  const project: Project = stores.project;
    
  const addNewDataSet = () => {
    project.datasets.addNew(true);
  };

  return useObserver(() => {

    const currentDataSet = project.datasets.currentItem;
    
    return (
      <section className="app-section card-designs">
        <H1>Data Sets</H1>
        <div className="col">
          <div className="row">
            <ControlGroup fill={true}>
              {entitySelect(project.datasets)}
              <Button icon="add" text="Add New Data Set" onClick={addNewDataSet}/>
            </ControlGroup>
          </div>
          <DataSetEditor dataSet={currentDataSet} />
        </div>
      </section>
    );
  });
};
