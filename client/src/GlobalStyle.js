import { createGlobalStyle } from 'styled-components';

/* eslint-disable no-unused-expressions */
const GlobalStyle = createGlobalStyle`
  html {
    position: relative;
    min-height: 100%;
  }
  #app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #fafafa;
  }
  .grecaptcha-badge {
    display: none;
  }
`;

export default GlobalStyle;
