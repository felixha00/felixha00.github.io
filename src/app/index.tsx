/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { HomePage } from './containers/HomePage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { Box, Container } from '@chakra-ui/core';

export function App() {
  return (
    <BrowserRouter>
      <Helmet titleTemplate="%s - Felix Ha" defaultTitle="Felix Ha">
        <meta name="description" content="Online portfolio of Felix Ha" />
      </Helmet>

      <Container p={6} maxW="3xl">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Container>

      <GlobalStyle />
    </BrowserRouter>
  );
}
