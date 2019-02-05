module.exports = [
  'VERIFY_EMAIL',
  'WELCOME',
  'FORGOT_PASSWORD',
  'PASSWORD_RESETED',
  'PASSWORD_CHANGED',
  'EMAIL_CHANGED',
].reduce((m, a) => {
  const k = m;

  k[a] = a;
  return m;
}, {});
