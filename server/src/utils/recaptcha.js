const axios = require('axios');
const querystring = require('querystring');

exports.validateRecaptchaResponse = async (secret, responseInput) => {
  let isValid = false;

  try {
    const response = await axios.post(
      'https://google.com/recaptcha/api/siteverify',
      querystring.stringify({
        secret,
        response: responseInput,
      }),
    );

    const recaptchaValidationRes = response.data;
    if (recaptchaValidationRes.success) isValid = true;
  } catch (err) {
    console.error(err);
  }

  return isValid;
};
