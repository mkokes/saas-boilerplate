module.exports = [
  'NOTIFICATION',
  'HANDLE_USERS_TRIAL',
  'HANDLE_USERS_SUBSCRIPTION',
  'MANAGE_MAILCHIMP_LIST',
].reduce((m, a) => {
  const k = m;

  k[a] = a;
  return m;
}, {});
