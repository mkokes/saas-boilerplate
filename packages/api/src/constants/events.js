module.exports = ['NOTIFICATION', 'HANDLE_USERS_TRIAL'].reduce((m, a) => {
  const k = m;

  k[a] = a;
  return m;
}, {});
