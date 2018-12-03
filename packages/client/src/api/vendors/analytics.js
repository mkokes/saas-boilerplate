import config from 'config';

export const AnalyticsApi = {
  setup() {
    if (config.MIXPANEL_ID && window.mixpanel) {
      window.mixpanel.init(config.MIXPANEL_ID);
    }
  },
  track(event) {
    if (config.MIXPANEL_ID) {
      window.mixpanel.track(event);
    }
  },
};
