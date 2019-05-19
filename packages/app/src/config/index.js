const APP_MODE = process.env.REACT_APP_MODE;

const config = {
  PRODUCT_NAME: 'PRODUCT_NAME',
  LEGAL_COMPANY_NAME: 'LEGAL_COMPANY_NAME',
  MAINTENANCE_MODE: false,
};
const modeConfig = require(`./${APP_MODE}.json`);

export default Object.freeze({
  ...config,
  ...modeConfig,
});
