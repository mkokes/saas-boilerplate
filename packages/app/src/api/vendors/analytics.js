import ReactGA from 'react-ga';

const MIXPANEL_ID = process.env.REACT_APP_MIXPANEL_ID;
const GA_ID = process.env.REACT_APP_GOOGLE_ANALYTICS;

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
    getDistinctId() {
      if (MIXPANEL_ID && window.mixpanel) {
        return window.mixpanel.get_distinct_id();
      }

      return null;
    },
  },
  ga: {
    initialize() {
      if (GA_ID) {
        ReactGA.initialize(GA_ID);
      }
    },
    pageview(path) {
      if (GA_ID) {
        ReactGA.pageview(path);
      }
    },
  },
};
