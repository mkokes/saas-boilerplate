/**
 *
 * HeadWay
 *
 */

import React from 'react';
import styled from 'styled-components';

import { NavItem, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const ChangelogNavItem = styled(NavItem)`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
`;

/* eslint-disable react/prefer-stateless-function */
class HeadWay extends React.PureComponent {
  componentDidMount() {
    window.Headway.init({
      selector: '.headway',
      trigger: '.headway-trigger',
      account: 'xaEvgx',
    });
  }

  render() {
    return (
      <ChangelogNavItem className="headway-trigger mr-3" id="headway-tooltip">
        <UncontrolledTooltip placement="bottom" target="headway-tooltip">
          Product updates
        </UncontrolledTooltip>

        <FontAwesomeIcon
          icon={faBell}
          color="gray"
          size="lg"
          id="headway-bell"
        />
        <div className="headway" />
      </ChangelogNavItem>
    );
  }
}

export default HeadWay;
