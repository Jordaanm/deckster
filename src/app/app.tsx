import * as React from 'react'
import { Tab, Tabs } from '@blueprintjs/core';
import { useObserver } from 'mobx-react-lite';

import { useStores } from '../stores/util';
import { DataSets } from '../data-set/data-set';
import { CardDesigns } from '../design/design';
import { Images } from '../image/images';
import { Transforms } from '../transform/transform';
import { GenerateConfigPage } from '../generate-config/page';

import './app.scss';
import './print.scss';
import "@blueprintjs/table/lib/css/table.css";
import "@blueprintjs/core/lib/css/blueprint.css";

const AppContainer: React.FC = () => {
  const { project } = useStores();
  React.useEffect(() => project.autoSave());

  return useObserver(() => {
    const tabChange = (id: string) => project.currentSection = id;

    return (
      <div className="app-container bp3-dark">
        <Tabs id='AppToolbarTabs' onChange={tabChange} selectedTabId={project.currentSection} className="full-xy">
          <Tab id='design' title='Card Designs' panel={<CardDesigns />} />
          <Tab id='data' title='Data Sets' panel={<DataSets />} />
          <Tab id='images' title='Images' panel={<Images />} />
          <Tab id='transform' title='Transforms' panel={<Transforms />} />
          <Tab id='generateConfigs' title='Card Sets' panel={<GenerateConfigPage />} />
        </Tabs>
      </div>
    );
  });
};

export default AppContainer;