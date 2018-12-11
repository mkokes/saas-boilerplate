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
      <ChangelogNavItem
        className="headway-trigger mr-3"
        id="UncontrolledTooltipExample"
      >
        <UncontrolledTooltip
          placement="bottom"
          target="UncontrolledTooltipExample"
        >
          Product updates
        </UncontrolledTooltip>

        <FontAwesomeIcon icon={faBell} color="gray" size="lg" />
        <div className="headway" />
      </ChangelogNavItem>
    );
  }
}

export default HeadWay;
