const axios = require('axios');
const querystring = require('querystring');

const config = require('../config');

exports.validateRecaptchaResponse = async responseInput => {
  let isValid = false;

  /* eslint-disable no-empty */
  try {
    const response = await axios.post(
      'https://google.com/recaptcha/api/siteverify',
      querystring.stringify({
        secret: config.RECAPTCHA_SECRET_KEY,
        response: responseInput,
      }),
    );

    const recaptchaValidationRes = response.data;
    if (recaptchaValidationRes.success) isValid = true;
  } catch (_) {}

  return isValid;
};
