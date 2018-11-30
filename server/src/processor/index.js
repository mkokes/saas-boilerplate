const { NOTIFICATION } = require('../constants/events');
const SendNotificationEmail = require('./tasks/sendNotificationEmail');

module.exports = async ({
  // config,
  log: parentLog,
  // scheduler,
  eventQueue,
  db,
}) => {
  const log = parentLog.create('processor');

  const sendNotificationEmail = SendNotificationEmail({
    log,
    db,
    eventQueue,
  });

  // listen for notifications
  db.on(NOTIFICATION, sendNotificationEmail);

  /* scheduler.schedule(
    'refreshActivePartyData',
    config.SYNC_DB_DELAY_SECONDS,
    refreshActivePartyData,
  ); */
};
