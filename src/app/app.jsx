import * as React from 'react'
import { Tab, Tabs } from '@blueprintjs/core';
import { useObserver } from 'mobx-react-lite';
import { useStores } from '../stores/util';
import { CardDesigns } from '../design/design';
import { DataSets } from '../data-set/data-set';

import "@blueprintjs/core/lib/css/blueprint.css";
import './app.scss'

const AppContainer = (props) => {
  const {ui} = useStores();

  return useObserver(() => {
    const tabChange = id => ui.currentSection = id;

    return (
      <div className="app-container">
        <Tabs id='AppToolbarTabs' onChange={tabChange} selectedTabId={ui.currentSection} className="full-xy">
          <Tab id='design' title='Card Designs' panel={<CardDesigns />} />
          <Tab id='data' title='Data Sets' panel={<DataSets />} />
        </Tabs>
      </div>
    );
  });
};

export default AppContainer;