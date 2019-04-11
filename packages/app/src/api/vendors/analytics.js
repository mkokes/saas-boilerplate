import ReactGA from 'react-ga';

import config from 'config';

const { MIXPANEL_ID, GOOGLE_ANALYTICS } = config;

export const AnalyticsApi = {
  mixpanel: {
    setup() {
      if (MIXPANEL_ID && window.mixpanel) {
        window.mixpanel.init(MIXPANEL_ID);
      }
    },
    track(event) {
      if (MIXPANEL_ID && window.mixpanel) {
        window.mixpanel.track(event);
      }
    },
    alias(userId) {
      if (MIXPANEL_ID && window.mixpanel) {
        window.mixpanel.alias(userId);
      }
    },
    identify(userId) {
      if (MIXPANEL_ID && window.mixpanel) {
        window.mixpanel.identify(userId);
      }
    },
    people: {
      set(data) {
        if (MIXPANEL_ID && window.mixpanel) {
          window.mixpanel.people.set({ ...data });
        }
      },
    },
  },
  ga: {
    initialize() {
      if (GOOGLE_ANALYTICS) {
        ReactGA.initialize(GOOGLE_ANALYTICS);
      }
    },
    pageview(path) {
      if (GOOGLE_ANALYTICS) {
        ReactGA.pageview(path);
      }
    },
  },
};
