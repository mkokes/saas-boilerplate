module.exports = ['USER', 'ADMIN'].reduce((m, a) => {
  const k = m;

  k[a] = a;
  return m;
}, {});
