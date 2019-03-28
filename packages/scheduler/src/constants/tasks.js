module.exports = ['HANDLE_USERS_TRIAL', 'HANDLE_USERS_SUBSCRIPTION'].reduce(
  (m, a) => {
    const k = m;

    k[a] = a;
    return m;
  },
  {},
);
