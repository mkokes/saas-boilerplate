const safeGet = require('lodash.get');
const ObjectId = require('mongoose');

const assertObjectId = async id => {
  if (!ObjectId.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId');
  }
};

const assertAuthToken = token => {
  try {
    if (!safeGet(token, 'type')) {
      throw new Error('No type key found');
    }
    if (!safeGet(token, 'password')) {
      throw new Error('No password key found');
    }
    if (!safeGet(token, '_id')) {
      throw new Error('No _id key found');
    }

    const userId = token._id;
    assertObjectId(userId);
  } catch (e) {
    throw new Error('Invalid token');
  }
};

const assertAccessTokenPayload = token => {
  try {
    assertAuthToken(token);

    if (token.type !== 'access') {
      throw new Error('Provided token is not an access_token');
    }
  } catch (e) {
    throw new Error('Invalid access token');
  }
};

const assertRefreshTokenPayload = token => {
  try {
    assertAuthToken(token);

    if (token.type !== 'refresh') {
      throw new Error('Provided token is not an refresh_token');
    }
  } catch (e) {
    throw new Error('Invalid refresh token');
  }
};

module.exports = {
  assertAccessTokenPayload,
  assertRefreshTokenPayload,
  assertObjectId,
};
