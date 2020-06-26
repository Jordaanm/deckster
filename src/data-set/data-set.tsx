import * as React from 'react';
import { useObserver} from 'mobx-react-lite';
import { useStores } from '../stores/util';
import { IStores } from '../stores/index';
import { H1, ControlGroup, MenuItem, Button } from '@blueprintjs/core';
import { Project } from '../stores/project';
import { UiStore } from '../stores/ui';
import { DataSetSelect, renderDataSetOption } from './dataset-select';
import { DataSetEditor } from './data-set-editor';
import { DataSet } from '../stores/types';

import "./data-set.scss"

export const DataSets: React.FC = () => {
  const stores: IStores = useStores();
  
  const project: Project = stores.project;
  const ui: UiStore = stores.ui;

  return useObserver(() => {

    const onItemSelect = (dataSet: DataSet) => ui.currentDataset = dataSet.id;
    const currentDataSet = project.getDataSet(ui.currentDataset);
    const selectText = currentDataSet ? currentDataSet.name : 'No Data Set Selected';
    
    const addNewDataSet = () => {
      const dataset = project.addNewDataSet();
      ui.currentDataset = dataset.id;
    };
    
    return (
      <section className="app-section card-designs">
        <H1>Data Sets</H1>
        <div className="col">
          <div className="row">
            <ControlGroup fill={true}>
              <DataSetSelect
                items={project.data}
                itemRenderer={renderDataSetOption}
                noResults={<MenuItem disabled={true} text="No Data Sets Added" />}
                onItemSelect={onItemSelect}
              >        
                <Button text={selectText} rightIcon="double-caret-vertical" />
              </DataSetSelect>
              <Button icon="add" text="Add New Data Set" onClick={addNewDataSet}/>
            </ControlGroup>
          </div>
          <DataSetEditor dataSet={currentDataSet} />
        </div>
      </section>
    );
  });
};
