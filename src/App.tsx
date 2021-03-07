import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';

import AppProvider from './hooks';
import { CssBaseline } from '@material-ui/core';

const App: React.FC = () => (
  <BrowserRouter>
    <AppProvider>
      <Routes />
    </AppProvider>

    <CssBaseline />
  </BrowserRouter>
);

export default App;