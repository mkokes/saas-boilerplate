import LogRocket from 'logrocket';

import config from 'config';

const { LOGROCKET_TOKEN } = config;

export const LogRocketApi = {
  setup() {
    if (LOGROCKET_TOKEN) {
      LogRocket.init(LOGROCKET_TOKEN);
    }
  },
  identify(userProfile) {
    if (LOGROCKET_TOKEN) {
      LogRocket.identify(userProfile._id, {
        name: `${userProfile.firstName} ${userProfile.lastName}` || 'Unknown',
        email: userProfile.email,

        isTrialing: userProfile.isTrialing,
        subscriptionId: userProfile._subscription,
      });
    }
  },
};
