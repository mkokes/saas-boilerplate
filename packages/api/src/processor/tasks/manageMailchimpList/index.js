const crypto = require('crypto');

module.exports = ({
  config: { MAILCHIMP_LIST_ID },
  log: parentLog,
  eventQueue,
  mailchimp,
  Sentry,
}) => {
  const log = parentLog.create('manageMailchimpList');

  return async ({
    user: { _id, firstName, lastName, email },
    oldEmail,
    status,
    actionType,
    tags,
  }) => {
    eventQueue.add(
      async () => {
        const md5 = data =>
          crypto
            .createHash('md5')
            .update(data)
            .digest('hex');

        try {
          /* eslint-disable default-case */
          switch (actionType) {
            case 'ADD':
              await mailchimp.post(`/lists/${MAILCHIMP_LIST_ID}/members`, {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                  FNAME: firstName,
                  LNAME: lastName,
                },
              });
              log.info(
                `user #${_id} email '${email}' has been added to list ${MAILCHIMP_LIST_ID}`,
              );
              break;
            case 'EMAIL_CHANGE':
              await mailchimp.patch(
                `/lists/${MAILCHIMP_LIST_ID}/members/${md5(oldEmail)}`,
                {
                  email_address: email,
                },
              );
              log.info(
                `user #${_id} email has been updated from '${oldEmail}' to '${email}' for list ${MAILCHIMP_LIST_ID}`,
              );

              break;
            case 'STATUS_CHANGE':
              await mailchimp.patch(
                `/lists/${MAILCHIMP_LIST_ID}/members/${md5(email)}`,
                {
                  status,
                },
              );
              log.info(
                `user #${_id} changed list subscription status to '${status}' for list ${MAILCHIMP_LIST_ID}`,
              );
              break;
            case 'UPDATE_MERGE_FIELDS':
              await mailchimp.patch(
                `/lists/${MAILCHIMP_LIST_ID}/members/${md5(email)}`,
                {
                  merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                  },
                },
              );
              log.info(
                `user #${_id} merge_fields were updated for email '${email}' in list ${MAILCHIMP_LIST_ID}`,
              );
              break;
            case 'UPDATE_TAGS':
              await mailchimp.patch(
                `/lists/${MAILCHIMP_LIST_ID}/members/${md5(email)}/tags`,
                {
                  tags,
                },
              );
              log.info(
                `user #${_id} tags were updated for email '${email}' in list ${MAILCHIMP_LIST_ID}`,
              );
              break;
          }
        } catch (err) {
          log.error(err);
          Sentry.captureException(err);
        }
      },
      { name: 'manageMailchimpList' },
    );
  };
};
