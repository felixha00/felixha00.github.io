import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`

  @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');
  
  html,
  body {
    height: 100%;
    width: 100%;
    background: black;
    color: #fff;
  }

  body {
    font-family: 'Roboto Mono', Helvetica, Arial, sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
    font-size: inherit;
  }

  #root {
    min-height: 100%;
    min-width: 100%;

  }

  p,
  label {
    font-family: 'Roboto Mono';
    line-height: 1.5em;
  }

  input, select {
    font-family: inherit;
    font-size: inherit;
  }

`;
