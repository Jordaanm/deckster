import * as React from 'react';
import { useStores } from '../stores/util';
import { Project } from '../stores/project';
import { MenuItem, Button, Popover, Menu, Position, H1, ControlGroup } from '@blueprintjs/core';
import { IStores } from '../stores/index';
import { useObserver } from 'mobx-react-lite';
import { DesignEditor } from './editor';

import './design.scss';
import { entitySelect } from '../app/entity-select';
import { DesignStore } from '../stores/design-store';

const addDesignMenu = (designs: DesignStore, $fileInput?: HTMLInputElement|null) => {
  const addNewDesign = () => {
    designs.addNew(true);
  };

  const triggerFile = () => {
    if($fileInput) {
      $fileInput.click();
    }
  };

  return (
    <Menu>
      <MenuItem text="From File" onClick={triggerFile} />
      <MenuItem text="From Text" onClick={addNewDesign}/>
    </Menu>
  );
};


export const CardDesigns: React.FC = () => {
  const stores: IStores = useStores();
  const [$fileInput, setFileInput] = React.useState<HTMLInputElement|null>();

  const project: Project = stores.project;

  return useObserver(() => {

    const currentDesign = project.designs.currentItem;

    const loadFile = (e: any) => {
      if(e?.target?.files?.length > 0) {
        var reader = new FileReader();
        reader.onload = function(){
          var dataURL = reader.result;
          const code = dataURL?.toString();
          if (code) {
            project.designs.addNew(true, {code});
          }
        };
        reader.readAsText(e.target.files[0]);  
      }
    };

    return (
      <section className="app-section card-designs">
        <H1>Card Designs</H1>
        <div className="col">
          <div className="row">
            <ControlGroup fill={true}>
              {entitySelect(project.designs)}
              <input
                type="file"
                accept=".svg"
                ref={x => setFileInput(x)}
                onChange={loadFile}
                className="hidden"
              />
              <Popover content={addDesignMenu(project.designs, $fileInput)} position={Position.RIGHT_TOP}>
                <Button icon="add" text="Add New Design" />
              </Popover>
            </ControlGroup>
          </div>
          <DesignEditor design={currentDesign} />
        </div>
      </section>
    );
  });
};
