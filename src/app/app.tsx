import * as React from 'react'
import { Tab, Tabs, Toaster, Intent } from '@blueprintjs/core';
import { useObserver } from 'mobx-react-lite';
import { HotKeys } from 'react-hotkeys';

import { Project } from '../stores/project';
import { useStores } from '../stores/util';
import { DataSets } from '../data-set/page';
import { CardDesigns } from '../design/page';
import { Images } from '../image/page';
import { Transforms } from '../transform/page';
import { DeckRenderPage } from '../render/page';
import { ProjectPage } from '../project/page';
import { HelpPage } from '../help/page';

import './app.scss';
import './print.scss';
import "@blueprintjs/table/lib/css/table.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import { TabTitle } from './tab-title';

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
            <Tab id='project' panel={<ProjectPage />}>
              <TabTitle label="Project" icon="projects" />
            </Tab>
            <Tab id='design' panel={<CardDesigns />} >
              <TabTitle label="Card Designs" icon="page-layout" />
            </Tab>
            <Tab id='data' panel={<DataSets />} >
              <TabTitle label="Data Sets" icon="th" />
            </Tab>
            <Tab id='images' panel={<Images />} >
              <TabTitle label="Images" icon="media" />
            </Tab>
            <Tab id='transform' panel={<Transforms />} >
              <TabTitle label="Transforms" icon="flows" />
            </Tab>
            <Tab id='generateConfigs' panel={<DeckRenderPage />} >
              <TabTitle label="Render Cards" icon="layers" />
            </Tab>
            <Tab id="help" panel={<HelpPage />} >
              <TabTitle label="Help" icon="help" />
            </Tab>
          </Tabs>
          <Toaster ref={toaster => setToaster(toaster)} position="bottom-right" />
        </div>
      </HotKeys>
    );
  });
};

export default AppContainer;