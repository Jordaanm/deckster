import * as React from 'react'
import { Tab, Tabs } from '@blueprintjs/core';
import { useObserver } from 'mobx-react-lite';

import { useStores } from '../stores/util';
import { CardDesigns } from '../design/design';
import { DataSets } from '../data-set/data-set';
import { Transforms } from '../transform/transform';

import './app.scss'
import "@blueprintjs/table/lib/css/table.css";
import "@blueprintjs/core/lib/css/blueprint.css";

const AppContainer: React.FC = () => {
  const {ui, project} = useStores();
  React.useEffect(() => project.autoSave());

  return useObserver(() => {
    const tabChange = (id: string) => ui.currentSection = id;

    return (
      <div className="app-container bp3-dark">
        <Tabs id='AppToolbarTabs' onChange={tabChange} selectedTabId={ui.currentSection} className="full-xy">
          <Tab id='design' title='Card Designs' panel={<CardDesigns />} />
          <Tab id='data' title='Data Sets' panel={<DataSets />} />
          <Tab id='transform' title='Transforms' panel={<Transforms />} />
        </Tabs>
      </div>
    );
  });
};

export default AppContainer;