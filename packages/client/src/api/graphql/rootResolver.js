import merge from 'lodash/merge';

const rootDefaults = {};

const resolvers = {
  Query: {},
  Mutation: {},
};

const defaults = merge(rootDefaults);
export default merge(resolvers);

export { defaults };
