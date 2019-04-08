export const displayBillingInterval = type => {
  let res;

  // eslint-disable-next-line default-case
  switch (type) {
    case 'yearly':
      res = 'year';
      break;
    case 'monthly':
      res = 'month';
      break;
  }

  return res;
};
