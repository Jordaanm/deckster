import React from 'react';
import { Provider } from 'mobx-react';
import './App.css';
import { Stores } from './stores/index';

import AppContainer from './app/app';

function App() {
  return (    
    <Provider {...Stores}>
      <div className="app">
        <AppContainer />
      </div>
    </Provider>
  );
}

export default App;
