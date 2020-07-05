import * as React from 'react';
import { Button, H1, ControlGroup } from '@blueprintjs/core';
import { useObserver } from 'mobx-react-lite';
import { useStores } from '../stores/util';
import { Project } from '../stores/project';
import { IStores } from '../stores/index';
import { renderTxOption } from './transform-select';
import { TransformEditor } from './transform-editor';
import { Transform } from '../stores/types';

// import './transform.scss';
import { entitySelect } from '../app/entity-select';

export const Transforms: React.FC = () => {
  const stores: IStores = useStores();

  const project: Project = stores.project;

  const addNewTx = () => {
    project.transforms.addNew(true);
  };

  return useObserver(() => {

    const currentTx = project.transforms.currentItem;
 
    return (
      <section className="app-section transforms">
        <H1>Transforms</H1>
        <div className="col">
          <div className="row">
            <ControlGroup fill={true}>
              {entitySelect<Transform>(project.transforms, renderTxOption)}
              <Button icon="add" text="Add New Transform" onClick={addNewTx} />
            </ControlGroup>
          </div>
          <TransformEditor transform={currentTx} />
        </div>
      </section>
    );
  });
};
