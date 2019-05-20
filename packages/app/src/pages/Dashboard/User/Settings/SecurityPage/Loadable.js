/**
 *
 * Asynchronously loads the component for SecurityPage
 *
 */

import loadable from 'loadable-components';

import Loader from 'components/Loader';

export default loadable(() => import('./index'), {
  LoadingComponent: Loader,
});
