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
  .beta-icon {
    margin-left: 12px;
    background-color: rgb(57, 131, 250);
    font-weight: 600;
    font-size: 13px;
    color: white;
    padding: 4px 9px;
    border-radius: 16px;
  }
  .grecaptcha-badge {
    display: none;
  }
`;

export default GlobalStyle;
