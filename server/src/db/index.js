const EventEmitter = require('eventemitter3');

const setupDb = require('./setup');
const User = require('./models/user');
const { NOTIFICATION } = require('../constants/events');
const { VERIFY_EMAIL } = require('../constants/notifications');

class Db extends EventEmitter {
  constructor({ config, nativeDb, log: parentLog }) {
    super();
    this._config = config;
    this._nativeDb = nativeDb;
    this._log = parentLog.create('db/core');
  }

  async _getUser(userId, { mustExist = false } = {}) {
    const user = await User.findOne({ _id: userId }).exec();

    if (mustExist && !user) {
      throw new Error(`User not found: ${userId}`);
    }

    return user;
  }

  async notifyUser(userId, type, data) {
    const obj = {
      _user: userId,
      type,
      data,
      email_sent: false,
      seen: false,
    };

    this.emit(NOTIFICATION, obj._id);
  }

  async signUpUser(email, password, name) {
    const user = new User({
      email,
      password,
      name,
    });

    const createdUser = await user.save();

    this.notifyUser(createdUser._id, VERIFY_EMAIL, {
      email: createdUser.email,
    });

    return createdUser;
  }

  async loginUser(userId) {
    const user = await this._getUser(userId, { mustExist: true });

    this._log.info(`Updating login timestamp for user ${userId}`);
    user.lastLoginAt = Date.now();
    await user.save();

    return this.getUserProfile(userId, true);
  }

  async getUserProfile(userId, canViewPrivateFields = false) {
    const user = await this._getUser(userId);

    if (!user) {
      return {};
    }

    const { lastLoginAt, email, name } = user;

    return {
      lastLoginAt,
      ...(canViewPrivateFields ? { email, name } : {}),
    };
  }
}

module.exports = async ({ config, log }) => {
  const nativeDb = await setupDb({ config, log });

  return new Db({ config, nativeDb, log });
};
