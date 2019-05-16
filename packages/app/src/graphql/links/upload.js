import { createUploadLink } from 'apollo-upload-client';

import config from 'config';

export default createUploadLink({ uri: `${config.API_URL}/graphql` });
