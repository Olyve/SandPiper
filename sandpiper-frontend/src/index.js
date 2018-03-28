import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import sandpiperApp from './Utilities/reducers';
import { loadState, saveState } from './Utilities/localStorage';

const persistedState = loadState();
const store = createStore(sandpiperApp, persistedState);

store.subscribe(() => {
  saveState(store.getState());
});

ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
), document.getElementById('root'));
registerServiceWorker();
