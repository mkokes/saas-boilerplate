/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add a container component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Form',
      validate: value => {
        if (/.+/.test(value)) {
          return componentExists(value)
            ? 'A component or container with this name already exists'
            : true;
        }

        return 'The name is required';
      },
    },
    {
      type: 'confirm',
      name: 'wantHeaders',
      default: false,
      message: 'Do you want headers?',
    },
    {
      type: 'confirm',
      name: 'wantLoadable',
      default: true,
      message: 'Do you want to load resources asynchronously?',
    },
  ],
  actions: data => {
    const actions = [
      {
        type: 'add',
        path: '../../src/containers/{{properCase name}}/index.js',
        templateFile: './container/class.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../src/containers/{{properCase name}}/tests/index.test.js',
        templateFile: './container/test.js.hbs',
        abortOnFail: true,
      },
    ];

    if (data.wantLoadable) {
      actions.push({
        type: 'add',
        path: '../../src/containers/{{properCase name}}/Loadable.js',
        templateFile: './component/loadable.js.hbs',
        abortOnFail: true,
      });
    }

    actions.push({
      type: 'prettify',
      path: '/containers/',
    });

    return actions;
  },
};
