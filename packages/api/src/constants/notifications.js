module.exports = [
  'VERIFY_EMAIL',
  'WELCOME_EMAIL',
  'FORGOT_PASSWORD',
  'PASSWORD_RESETED',
  'PASSWORD_CHANGED',
  'EMAIL_CHANGED',
  'WEBSITE_CONTACT_FORM',
].reduce((m, a) => {
  const k = m;

  k[a] = a;
  return m;
}, {});
