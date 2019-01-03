import { getProvider as getGlobalProvider } from 'GlobalState';

export const PaddleCheckoutAPI = {
  async checkout(productId, cb) {
    if (window.Paddle) {
      const globalProvider = await getGlobalProvider();
      const user = await globalProvider.state.auth.profile;

      window.Paddle.Checkout.open({
        product: productId,
        email: user.email,
        passthrough: JSON.stringify({ _id: user._id }),
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
