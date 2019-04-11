import { getProvider as getGlobalProvider } from 'GlobalState';

import config from 'config';

const { PADDLE_VENDOR_ID } = config;

export const PaddleApi = {
  setup() {
    if (window.Paddle) {
      window.Paddle.Setup({
        vendor: parseInt(PADDLE_VENDOR_ID, 10),
      });
    }
  },
  async checkout(productId, cb) {
    if (window.Paddle) {
      const globalProvider = await getGlobalProvider();
      const user = await globalProvider.state.auth.profile;

      window.Paddle.Checkout.open({
        product: productId,
        email: user.email,
        passthrough: JSON.stringify({
          host: window.location.host,
          _id: user._id,
        }),
        disableLogout: true,
        successCallback: () => {
          cb();
        },
      });
    }
  },
  async open(paddleUrl) {
    if (window.Paddle) {
      window.Paddle.Checkout.open({
        override: paddleUrl,
      });
    }
  },
};
