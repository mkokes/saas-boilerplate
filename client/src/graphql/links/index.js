import { ApolloLink } from 'apollo-link';

import client from './client';
import http from './http';
import auth from './auth';
import error from './error';

export default args =>
  ApolloLink.from([auth(args), client(args), error(args), http(args)]);
