import React from 'react';
import MainNavigation from './src/navigation/MainNavigation.js';
import {DataProvider} from './src/services/DataContext.js';

function App(): React.JSX.Element {
  return (
    <DataProvider>
      <MainNavigation />
    </DataProvider>
  );
}

export default App;
