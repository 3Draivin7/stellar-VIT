import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { App } from './components/app/app';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './services/store';
import { Helmet } from 'react-helmet';
//import favicon  from './svg/favicon.png'

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);
const favicon = require('./svg/favicon.png')
root.render(
  <>
<Helmet>
  <title>Звездный сезон</title>
  <link rel="shortcut icon" type="image/x-icon" href={favicon} />
</Helmet>
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  </>
);

