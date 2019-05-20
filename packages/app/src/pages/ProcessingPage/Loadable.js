/**
 *
 * Asynchronously loads the component for ProcessingPage
 *
 */

import loadable from 'loadable-components';

import Loader from 'components/Loader';

export default loadable(() => import('./index'), {
  LoadingComponent: Loader,
});
