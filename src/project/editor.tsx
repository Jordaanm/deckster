import * as React from 'react';
import { Project } from '../stores/project';
import { useObserver } from 'mobx-react-lite';
import { H2, EditableText, Button, FormGroup, Switch, Label, ButtonGroup, Intent, Slider } from '@blueprintjs/core';
import FileSaver from 'file-saver';
import { fileLoader } from '../stores/util';

interface ProjectEditorProps {
  project: Project;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = (props) => {
  const [$fileInput, setFileInput] = React.useState<HTMLInputElement|null>();

  const {project} = props;
  const toggleAutosave = () => { project.enableAutosave = !project.enableAutosave; };

  return useObserver(() => {

    const loadFile = fileLoader((result: string|ArrayBuffer|null) => {
        const data = result?.toString();
        if(data) {
          const json = JSON.parse(atob(data.substr(29)));
          const newProject: Project = Project.loadFromJson(json);
          project.loadFromProject(newProject);
        }
    });

    const changeName = (newName: string) => project.name = newName;
    const saveToFile = () => {
      var json = project.serialise();
      var blob = new Blob([json], {type: 'application/json;charset=utf-8'});

      FileSaver.saveAs(blob, 'project.json');
    };

    const save = () => {
      project.saveToLocalStorage();
    }

    const importFile = () => {
      if($fileInput) {
        $fileInput.click();
      }
    };

    return (
      <section className="row editor">
        <div className="f1 col">
          <div className="row">
            <input
              type="file"
              accept=".json"
              ref={x => setFileInput(x)}
              onChange={loadFile}
              className="hidden"
            />
            <ButtonGroup large={true}>
              <Button icon="saved" text="Save Project" onClick={save} intent={Intent.PRIMARY} />  
              <Button icon="export" text="Export Save File" onClick={saveToFile} intent={Intent.PRIMARY} />  
              <Button icon="import" text="Import Save File" onClick={importFile} intent={Intent.PRIMARY} />  
            </ButtonGroup>
          </div>
          <div className="row">
            <Label>
              Project Name
              <H2><EditableText onChange={changeName} value={project.name} /></H2>
            </Label>
          </div>
          <div className="row">
            <FormGroup label="Autosave Settings" intent={Intent.PRIMARY} className="full-x">
              <Switch label="Enable Autosave" checked={project.enableAutosave} onChange={toggleAutosave} />
              <Label>
                Autosave Period
                <Slider value={project.autosavePeriod} min={15} max={360} onChange={val => project.updateAutosavePeriod(val)} intent={Intent.PRIMARY} labelStepSize={30} />
                {/* <NumericInput value={(project.autosavePeriod || 0).toString()} onValueChange={val => project.updateAutosavePeriod(val)} leftIcon="stopwatch" large={true} /> */}
              </Label>
            </FormGroup>
          </div>       
        </div>
      </section>
    );
  });
}