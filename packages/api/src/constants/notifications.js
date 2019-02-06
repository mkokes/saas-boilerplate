module.exports = [
  'VERIFY_EMAIL',
  'WELCOME',
  'FORGOT_PASSWORD',
  'PASSWORD_RESETED',
  'PASSWORD_CHANGED',
  'EMAIL_CHANGED',
  'TRIAL_EXPIRING',
  'TRIAL_EXPIRED',
  'ENABLED_2FA',
  'DISABLED_2FA',
].reduce((m, a) => {
  const k = m;

  k[a] = a;
  return m;
}, {});
