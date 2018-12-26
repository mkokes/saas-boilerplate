import { getProvider as getGlobalProvider } from 'GlobalState';

export const PaddleCheckoutAPI = {
  async checkout(productId) {
    if (window.Paddle) {
      const globalProvider = await getGlobalProvider();
      const user = await globalProvider.state.auth.profile;

      window.Paddle.Checkout.open({
        product: productId,
        email: user.email,
        passthrough: JSON.stringify({ _id: user._id }),
        disableLogout: true,
        successCallback: data => {
          console.debug(data);
          alert(JSON.stringify(data));
          // redirect to /dashboard/order_verification?checkoutId=123
        },
      });
    }
  },
};
