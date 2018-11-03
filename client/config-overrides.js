const rewireStyledComponents = require('react-app-rewire-styled-components');

module.exports = function override(config, env) {
  /* eslint-disable no-param-reassign */
  config = rewireStyledComponents(config, env, {
    displayName: true,
  });
  return config;
};
