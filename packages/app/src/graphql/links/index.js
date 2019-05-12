import { ApolloLink } from 'apollo-link';

import client from './client';
import auth from './auth';
import refreshToken from './refreshToken';
import error from './error';
import http from './http';

export default args =>
  ApolloLink.from([
    auth(args),
    client(args),
    error(args),
    refreshToken(args),
    http(args),
  ]);
