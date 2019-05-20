/**
 * Page Generator
 */

const componentExists = require('../utils/exists');

module.exports = {
  description: 'Add a page component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Form',
      validate: value => {
        if (/.+/.test(value)) {
          return componentExists(value)
            ? 'A component or page with this name already exists'
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
        path: '../../src/pages/{{properCase name}}/index.js',
        templateFile: './page/class.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../src/pages/{{properCase name}}/tests/index.test.js',
        templateFile: './page/test.js.hbs',
        abortOnFail: true,
      },
    ];

    if (data.wantLoadable) {
      actions.push({
        type: 'add',
        path: '../../src/pages/{{properCase name}}/Loadable.js',
        templateFile: './page/loadable.js.hbs',
        abortOnFail: true,
      });
    }

    actions.push({
      type: 'prettify',
      path: '/pages/',
    });

    return actions;
  },
};
