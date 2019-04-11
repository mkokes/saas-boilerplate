const APP_MODE = process.env.REACT_APP_MODE;

const config = {
  MAINTENANCE_MODE: false,
};
const modeConfig = require(`./${APP_MODE}.json`);

export default Object.freeze({
  ...config,
  ...modeConfig,
});
