import * as React from 'react'
import { Tab, Tabs } from '@blueprintjs/core';
import { useObserver } from 'mobx-react-lite';

import { useStores } from '../stores/util';
import { DataSets } from '../data-set/page';
import { CardDesigns } from '../design/page';
import { Images } from '../image/page';
import { Transforms } from '../transform/page';
import { GenerateConfigPage } from '../render/page';

import './app.scss';
import './print.scss';
import "@blueprintjs/table/lib/css/table.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import { ProjectPage } from '../project/page';

const AppContainer: React.FC = () => {
  const { project } = useStores();
  React.useEffect(() => project.autoSave());

  return useObserver(() => {
    const tabChange = (id: string) => project.currentSection = id;

    return (
      <div className="app-container bp3-dark">
        <Tabs id='AppToolbarTabs' onChange={tabChange} selectedTabId={project.currentSection} className="full-xy">
          <Tab id='project' title='Project' panel={<ProjectPage />} />
          <Tab id='design' title='Card Designs' panel={<CardDesigns />} />
          <Tab id='data' title='Data Sets' panel={<DataSets />} />
          <Tab id='images' title='Images' panel={<Images />} />
          <Tab id='transform' title='Transforms' panel={<Transforms />} />
          <Tab id='generateConfigs' title='Render Cards' panel={<GenerateConfigPage />} />
        </Tabs>
      </div>
    );
  });
};

export default AppContainer;