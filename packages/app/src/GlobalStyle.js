import { createGlobalStyle } from 'styled-components';

/* eslint-disable no-unused-expressions */
const GlobalStyle = createGlobalStyle`
  html {
    position: relative;
    min-height: 100%;
  }
  legend {
    display: block;
    width: 100%;
    padding: 0;
    margin-bottom: 20px;
    font-size: 21px;
    line-height: 40px;
    color: #333;
    border: 0;
    border-bottom: 1px solid #e5e5e5;
  }
  #app {
    height: 100%;
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
  .flex {
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;
  }

  /* Google reCAPTCHA */
  .grecaptcha-badge {
    display: none;
  }

  /* Headway.co */
  #HW_badge {
    top: -2px !important;
    left: -6px !important;
  }
  #HW_badge_cont {
    width: 0px !important;
  }
`;

export default GlobalStyle;
