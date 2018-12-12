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
};
