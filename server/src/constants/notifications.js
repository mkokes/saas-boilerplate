module.exports = ['VERIFY_EMAIL', 'WELCOME_EMAIL'].reduce((m, a) => {
  const k = m;

  k[a] = a;
  return m;
}, {});
