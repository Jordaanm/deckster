import * as React from 'react';
import { useStores } from '../stores/util';
import { CardDesignSelect, renderDesignOption } from './design-select';
import { Project } from '../stores/project';
import { MenuItem, Button, Popover, Menu, Position, H1, ControlGroup } from '@blueprintjs/core';
import { UiStore } from '../stores/ui';
import { IStores } from '../stores/index';
import { useObserver } from 'mobx-react-lite';
import { DesignEditor } from './design-editor';
import { CardDesign } from '../stores/types';

const addDesignMenu = (stores: IStores, $fileInput?: HTMLInputElement|null) => {
  const project: Project = stores.project;
  const ui: UiStore = stores.ui;

  const addNewDesign = () => {
    console.log("Hello");
    const design = project.addNewDesign();
    ui.currentDesign = design.id;
  };

  const triggerFile = () => {
    console.log("LoadFile");
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
  const ui: UiStore = stores.ui;

  return useObserver(() => {

    const onItemSelect = (design: CardDesign) => ui.currentDataset = design.id;
    const currentDesign = project.getDesign(ui.currentDesign);
    const selectText = currentDesign ? currentDesign.name : 'No Design Selected';

    const loadFile = (e: any) => {
      console.log(e.target.files);
      if(e?.target?.files?.length > 0) {
        var reader = new FileReader();
        reader.onload = function(){
          var dataURL = reader.result;       
          const design = project.addNewDesign(dataURL?.toString());
          ui.currentDesign = design.id;
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
              <CardDesignSelect
                items={project.designs}
                itemRenderer={renderDesignOption}
                noResults={<MenuItem disabled={true} text="No Designs Added" />}
                onItemSelect={onItemSelect}
              >        
                <Button text={selectText} rightIcon="double-caret-vertical" />
              </CardDesignSelect>
              <input
                type="file"
                accept=".svg"
                ref={x => setFileInput(x)}
                onChange={loadFile}
                className="hidden"
              />
              <Popover content={addDesignMenu(stores, $fileInput)} position={Position.RIGHT_TOP}>
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
