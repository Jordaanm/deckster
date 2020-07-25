import * as React from 'react';
import { Project } from '../stores/project';
import { useObserver } from 'mobx-react-lite';
import { H2, EditableText, Button, FormGroup, Switch } from '@blueprintjs/core';
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

    const importFile = () => {
      if($fileInput) {
        $fileInput.click();
      }
    };

    return (
      <section className="row editor">
        <div className="f1 col">
          <div className="row">
            <H2><EditableText onChange={changeName} value={project.name} /></H2>
          </div>
          <div className="row">
              <input
                type="file"
                accept=".json"
                ref={x => setFileInput(x)}
                onChange={loadFile}
                className="hidden"
              />             
            <Button icon="export" text="Export Save File" onClick={saveToFile}/>  
            <Button icon="import" text="Import Save File" onClick={importFile}/>  
          </div>
          <div className="row">
            <FormGroup label="Autosave Settings">
              <Switch label="Enable Autosave" checked={project.enableAutosave} onChange={toggleAutosave} />
            </FormGroup>
          </div>       
        </div>
      </section>
    );
  });
}