const safeGet = require('lodash.get');
const ObjectId = require('mongoose');

const assertObjectId = async id => {
  if (!ObjectId.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId');
  }
};

const assertUser = async user => {
  try {
    if (!safeGet(user, '_id')) {
      throw new Error('Not logged in');
    }

    await assertObjectId(user._id);
  } catch (e) {
    throw new Error('Invalid user');
  }
};

module.exports = {
  assertUser,
  assertObjectId,
};
