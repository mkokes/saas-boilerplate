module.exports = [
  'VERIFY_EMAIL',
  'WELCOME_EMAIL',
  'FORGOT_PASSWORD',
  'PASSWORD_RESETED',
].reduce((m, a) => {
  const k = m;

  k[a] = a;
  return m;
}, {});
