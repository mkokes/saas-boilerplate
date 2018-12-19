module.exports = [
  'TERMS_AND_CONDITIONS',
  'PRIVACY_POLICY',
  'MARKETING_INFO',
].reduce((m, a) => {
  const k = m;

  k[a] = a;
  return m;
}, {});
