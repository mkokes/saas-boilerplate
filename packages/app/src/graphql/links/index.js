import { ApolloLink } from 'apollo-link';

import client from './client';
import auth from './auth';
import error from './error';
import retry from './retry';
import http from './http';

export default args =>
  ApolloLink.from([
    auth(args),
    client(args),
    error(args),
    retry(args),
    http(args),
  ]);
