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
import { Container } from '@chakra-ui/core';

export function App() {
  return (
    <BrowserRouter>
      <Helmet titleTemplate="%s - Felix Ha" defaultTitle="Felix Ha">
        <meta
          name="description"
          content="Projects Portfolio of Felix Ha built with React"
        />
      </Helmet>

      <Container py={{ base: 4, lg: 16 }} maxW="container.xl">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Container>
      <GlobalStyle />
    </BrowserRouter>
  );
}
