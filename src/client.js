import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import 'semantic-ui-css/semantic.min.css';

import Routes from './routes';

ReactDOM.render(
  <AppContainer>
    <Routes/>
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./routes', () => {
    const NextApp = require('./routes').default; // eslint-disable-line global-require

    ReactDOM.render(
      <AppContainer>
        <NextApp/>
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
