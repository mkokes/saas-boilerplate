/**
 * Exists
 *
 * Check whether the given component exist in either the components or pages directory
 */

const fs = require('fs');
const path = require('path');
const components = fs.readdirSync(
  path.join(__dirname, '../../../src/components'),
);
const pages = fs.readdirSync(path.join(__dirname, '../../../src/pages'));
const allComponents = components.concat(pages);

function componentExists(comp) {
  return allComponents.indexOf(comp) >= 0;
}

module.exports = componentExists;
