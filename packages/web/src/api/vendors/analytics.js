const MIXPANEL_ID = process.env.REACT_APP_MIXPANEL_ID;

export const AnalyticsApi = {
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
};
