// foo

import _ from 'lodash';

const mappings = {};

export const dataIdFromObject = o => {
  const { __typename: type } = o;

  let id;

  const mapProps = mappings[type];
  if (mapProps) {
    id = mapProps.reduce((str, p) => `${str}${_.get(o, p, '')}`, '');
  } else {
    id = JSON.stringify(o);
  }

  return id;
};
