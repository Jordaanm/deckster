import * as React from 'react';
import { MenuItem, Button, H1, ControlGroup } from '@blueprintjs/core';
import { useObserver } from 'mobx-react-lite';
import { useStores } from '../stores/util';
import { Project } from '../stores/project';
import { UiStore } from '../stores/ui';
import { IStores } from '../stores/index';
import { TransformSelect, renderTxOption } from './transform-select';
import { TransformEditor } from './transform-editor';
import { Transform } from '../stores/types';

// import './transform.scss';

export const Transforms: React.FC = () => {
  const stores: IStores = useStores();

  const project: Project = stores.project;
  const ui: UiStore = stores.ui;

  const addNewTx = () => {
    const tx = project.addNewTransform();
    ui.currentTransform = tx.id;
  };

  return useObserver(() => {

    const onItemSelect = (tx: Transform) => ui.currentTransform = tx.id;
    const currentTx = project.getTransform(ui.currentTransform);
    const selectText = currentTx ? currentTx.name : 'No Transform Selected';
 
    return (
      <section className="app-section transforms">
        <H1>Transforms</H1>
        <div className="col">
          <div className="row">
            <ControlGroup fill={true}>
              <TransformSelect
                items={project.transforms}
                itemRenderer={renderTxOption}
                noResults={<MenuItem disabled={true} text="No Transforms Added" />}
                onItemSelect={onItemSelect}
              >        
                <Button text={selectText} rightIcon="double-caret-vertical" />
              </TransformSelect>
              <Button icon="add" text="Add New Transform" onClick={addNewTx} />
            </ControlGroup>
          </div>
          <TransformEditor transform={currentTx} />
        </div>
      </section>
    );
  });
};
