module.exports = ['EXAMPLE_FEATURE'].reduce((m, a) => {
  const k = m;

  k[a] = a;
  return m;
}, {});
