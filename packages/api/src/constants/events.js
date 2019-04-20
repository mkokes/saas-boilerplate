module.exports = [
  'NOTIFICATION',
  'HANDLE_USERS_TRIAL',
  'HANDLE_USERS_SUBSCRIPTION',
  'MAILCHIMP',
  'MIXPANEL_EVENT',
  'PADDLE',
].reduce((m, a) => {
  const k = m;

  k[a] = a;
  return m;
}, {});
