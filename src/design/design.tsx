import * as React from 'react';
import { useStores } from '../stores/util';
import { CardDesignSelect, renderDesignOption } from './design-select';
import { Project } from '../stores/project';
import { MenuItem, Button, Popover, Menu, Position, H1, H2, InputGroup } from '@blueprintjs/core';
import { UiStore } from '../stores/ui';
import { IStores } from '../stores/index';
import { useObserver } from 'mobx-react-lite';
import CodeMirror from 'react-codemirror';
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/lib/codemirror.css";

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

const cmOptions = {
  lineNumbers: true,
  lineWrapping: true,
  mode: 'htmlmixed'
};

export const CardDesigns: React.FC = () => {
  const stores: IStores = useStores();
  const [$fileInput, setFileInput] = React.useState<HTMLInputElement|null>();

  const project: Project = stores.project;
  const ui: UiStore = stores.ui;

  return useObserver(() => {

    const onItemSelect = console.log.bind(console, "Design Selected");
    const currentDesign = project.getDesign(ui.currentDesign);
    const selectText = currentDesign ? currentDesign.name : 'No Design Selected';
    const changeName = (e: any) => { if(currentDesign) { currentDesign.name = e.target.value; }};

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

    const updateCode = (newCode: string) => {
      const design = project.getDesign(ui.currentDesign);
      if(design) {
        design.code = newCode;
      }
    };

    const removeCurrentDesign = () => {
      project.removeDesign(ui.currentDesign || -1);      
    }

    return (
      <section className="app-section card-designs">
        <H1>Card Designs</H1>
        <div className="row f1">
          <div className="f1">
            <div className="row">
              <H2>Data</H2>
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
            </div>
            { currentDesign && <div className="row">
              <InputGroup large={true} value={currentDesign?.name} onChange={changeName} />
              <Button icon="delete" text="Remove this Design" onClick={removeCurrentDesign}/>
            </div> }
            { currentDesign && <div className="row f1 full-y">
              <CodeMirror value={currentDesign?.code} onChange={updateCode} options={cmOptions} />
            </div> }
          </div>
          <div className="f1">
            <h2>Visual</h2>
            { currentDesign && 
              <div className="row full-xy" dangerouslySetInnerHTML={{__html: currentDesign.code}} /> 
            }
          </div>
        </div>
      </section>
    );
  });
};
