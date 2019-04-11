import { HttpLink } from 'apollo-link-http';

import config from 'config';

export default () => new HttpLink({ uri: `${config.API_URL}/graphql` });
