import * as React from 'react';
import { Project } from '../stores/project';
import { useObserver } from 'mobx-react-lite';
import { H2, EditableText, Button, FormGroup, Switch, Label, ButtonGroup, Intent, Slider } from '@blueprintjs/core';

interface ProjectEditorProps {
  project: Project;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = (props) => {

  const {project} = props;
  const toggleAutosave = () => { project.enableAutosave = !project.enableAutosave; };

  return useObserver(() => {

    const changeName = (newName: string) => project.name = newName;

    return (
      <section className="row editor">
        <div className="f1 col">
          <div className="row">
            <ButtonGroup large={true}>
              <Button icon="saved" text="Save Project" onClick={() => project.saveToLocalStorage()} intent={Intent.PRIMARY} />  
              <Button icon="export" text="Export Save File" onClick={() => project.exportToFile()} intent={Intent.PRIMARY} />  
              <Button icon="import" text="Import Save File" onClick={() => project.importFile()} intent={Intent.PRIMARY} />  
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
              </Label>
            </FormGroup>
          </div>       
        </div>
      </section>
    );
  });
}