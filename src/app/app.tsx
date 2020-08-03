import * as React from 'react'
import { Tab, Tabs, Toaster, Intent } from '@blueprintjs/core';
import { useObserver } from 'mobx-react-lite';
import { HotKeys } from 'react-hotkeys';

import { useStores } from '../stores/util';
import { DataSets } from '../data-set/page';
import { CardDesigns } from '../design/page';
import { Images } from '../image/page';
import { Transforms } from '../transform/page';
import { GenerateConfigPage } from '../render/page';
import { ProjectPage } from '../project/page';

import './app.scss';
import './print.scss';
import "@blueprintjs/table/lib/css/table.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import { Project } from '../stores/project';

const keyMap = {
  SAVE_PROJECT: "alt+s",
  EXPORT_PROJECT: "alt+shift+s",
  IMPORT_PROJECT: "alt+o",
  TOGGLE_AUTOSAVE: "alt+shift+a"
};

const getHotkeyHandlers = (project: Project, toggleAutosave: () => void): any => {
  return {
    SAVE_PROJECT: () => project.saveToLocalStorage(),
    EXPORT_PROJECT: () => project.exportToFile(),
    IMPORT_PROJECT: () => project.importFile(),
    TOGGLE_AUTOSAVE: () => toggleAutosave()
  }
};

const AppContainer: React.FC = () => {
  const { project } = useStores();
  const [toaster, setToaster] = React.useState<Toaster|null>(null);
  React.useEffect(() => project.autoSave());

  return useObserver(() => {
    const tabChange = (id: string) => project.currentSection = id;
    const toggleAutosave = () => {
      console.log("A");
      const isOn = project.toggleAutosave();
      toaster?.show({
        intent: Intent.PRIMARY,
        message: isOn ? "Autosave Enabled" : "Autosave Disabled"
      });
    }

    const handlers = getHotkeyHandlers(project, toggleAutosave);

    return (
      <HotKeys keyMap={keyMap} handlers={handlers} className="full-xy">
        <div className="app-container bp3-dark">
          <Tabs id='AppToolbarTabs' onChange={tabChange} selectedTabId={project.currentSection} className="full-xy">
            <Tab id='project' title='Project' panel={<ProjectPage />} />
            <Tab id='design' title='Card Designs' panel={<CardDesigns />} />
            <Tab id='data' title='Data Sets' panel={<DataSets />} />
            <Tab id='images' title='Images' panel={<Images />} />
            <Tab id='transform' title='Transforms' panel={<Transforms />} />
            <Tab id='generateConfigs' title='Render Cards' panel={<GenerateConfigPage />} />
          </Tabs>
          <Toaster ref={toaster => setToaster(toaster)} position="bottom-right" />
        </div>
      </HotKeys>
    );
  });
};

export default AppContainer;