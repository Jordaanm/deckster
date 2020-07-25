import * as React from 'react';
import { useObserver} from 'mobx-react-lite';
import { useStores } from '../stores/util';
import { IStores } from '../stores/index';
import { H1, ControlGroup, Button } from '@blueprintjs/core';
import { Project } from '../stores/project';
import { RenderEditor } from './editor';

import { entitySelect } from '../app/entity-select';

export const GenerateConfigPage: React.FC = () => {
  const stores: IStores = useStores();
  
  const project: Project = stores.project;
    
  const addNewCardSet = () => {
    project.renders.addNew(true);
  };

  return useObserver(() => {
    const store = project.renders;
    const current = store.currentItem;
    
    return (
      <section className="app-section card-designs">
        <H1>{store.label}</H1>
        <div className="col">
          <div className="row">
            <ControlGroup fill={true}>
              {entitySelect(project.renders)}
              <Button icon="add" text="Add New Card Set" onClick={addNewCardSet}/>
            </ControlGroup>
          </div>
          <RenderEditor config={current} />
        </div>
      </section>
    );
  });
};
