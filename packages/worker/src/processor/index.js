module.exports = async ({
  // config,
  log: parentLog,
  // scheduler,
}) => {
  const log = parentLog.create('processor');
  log.info('processor started');

  /* scheduler.schedule(
    'refreshActivePartyData',
    config.SYNC_DB_DELAY_SECONDS,
    refreshActivePartyData,
  ); */
};
