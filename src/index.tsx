import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from 'serviceWorker';
import 'sanitize.css/sanitize.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/core';
import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';
import { configureAppStore } from 'store/configureStore';

// Initialize languages
import './locales/i18n';

const store = configureAppStore();
const MOUNT_NODE = document.getElementById('root') as HTMLElement;

interface Props {
  Component: typeof App;
}

const theme = extendTheme({
  styles: {
    global: props => ({
      // body: {
      //   bg: mode('blackAlpha.50', 'blackAlpha.900')(props),
      // },
      // h1: {
      //   fontWeight: 500,
      //   marginBottom: '0.5em',
      // },
      p: {
        color: 'whiteAlpha.700',
        fontWeight: 400,
      },
    }),
  },
  fonts: {
    heading: 'Space Grotesk',
    body: 'Roboto Mono',
  },

  colors: {
    my: {
      p: '#9b9b9b',
      bg: '#232323',
      primary: '',
      secondary: '',
    },
  },
});

const ConnectedApp = ({ Component }: Props) => (
  <ChakraProvider theme={theme}>
    <Provider store={store}>
      <HelmetProvider>
        <React.StrictMode>
          <Component />
        </React.StrictMode>
      </HelmetProvider>
    </Provider>
  </ChakraProvider>
);
const render = (Component: typeof App) => {
  ReactDOM.render(<ConnectedApp Component={Component} />, MOUNT_NODE);
};

if (module.hot) {
  // Hot reloadable translation json files and app
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./app', './locales/i18n'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    const App = require('./app').App;
    render(App);
  });
}

render(App);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
