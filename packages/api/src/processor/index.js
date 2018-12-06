const { NOTIFICATION } = require('../constants/events');
const SendNotificationEmail = require('./tasks/sendNotificationEmail');

module.exports = async ({
  // config,
  log: parentLog,
  db,
}) => {
  const log = parentLog.create('processor');

  const sendNotificationEmail = SendNotificationEmail({
    log,
    db,
  });

  // listen for notifications
  db.on(NOTIFICATION, sendNotificationEmail);
};
