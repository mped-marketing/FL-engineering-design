import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import { AppContainer } from 'react-hot-loader';
import NextApp from './NextApp';
//import registerServiceWorker from './registerServiceWorker';
// Add this import:

// Wrap the rendering in a function:
const render = (Component) => {
  ReactDOM.render(
    // Wrap App inside AppContainer
    <AppContainer>
      <NextApp />
    </AppContainer>,
    document.getElementById('root'),
  );
};

// Do this once//
//registerServiceWorker();

// Render once
render(NextApp);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./NextApp', () => {
    render(NextApp);
  });
}
