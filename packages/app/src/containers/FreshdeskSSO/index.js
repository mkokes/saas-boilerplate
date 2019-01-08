/**
 *
 * FreshdeskSSO
 *
 */

import React, { Fragment } from 'react';

import SafeQuery from 'components/graphql/SafeQuery';
import { GetFreshdeskSSO } from 'graphql/queries';

/* eslint-disable react/prefer-stateless-function */
export default class FreshdeskSSO extends React.PureComponent {
  render() {
    return (
      <SafeQuery query={GetFreshdeskSSO} fetchPolicy="network-only">
        {({ data }) => {
          console.debug(data);
          return '1';
        }}
      </SafeQuery>
    );
  }
}

FreshdeskSSO.propTypes = {};
