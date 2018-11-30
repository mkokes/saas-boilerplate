/**
 *
 * LegalTermsPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import {
  Container,
  Row,
  Col,
  TabContent,
  TabPane as DefaultTabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import classnames from 'classnames';
import styled from 'styled-components';

const TabPane = styled(DefaultTabPane)`
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  padding: 10px;
`;

/* eslint-disable react/prefer-stateless-function */
class LegalTermsPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const { location } = this.props;

    let activeTab = '1';
    if (location.hash === '#pp') activeTab = '2';

    this.state = {
      activeTab,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(tab) {
    const { activeTab } = this.state;

    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const { activeTab } = this.state;

    return (
      <Container tag="main">
        <Helmet>
          <title>LegalTermsPage</title>
          <meta name="description" content="Description of LegalTermsPage" />
        </Helmet>
        <Row className="justify-content-center">
          <Col md="12" className="text-center">
            <span className="display-3 d-block">Legal Terms</span>
          </Col>
        </Row>
        <Nav tabs className="mt-4">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => {
                this.toggle('1');
              }}
            >
              Terms of Service
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => {
                this.toggle('2');
              }}
            >
              Privacy Policy
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab} className="mb-4">
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <div className="mb-3">
                  <span>Last update: 05/25/2018</span>
                </div>
                <div className="mb-1">
                  <strong>1. Acceptance of Terms</strong>
                </div>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
                  quia voluptas sit aspernatur aut odit aut fugit, sed quia
                  consequuntur magni dolores eos qui ratione voluptatem sequi
                  nesciunt. Neque porro quisquam est, qui dolorem ipsum quia
                  dolor sit amet, consectetur, adipisci velit, sed quia non
                  numquam eius modi tempora incidunt ut labore et dolore magnam
                  aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
                  nostrum exercitationem ullam corporis suscipit laboriosam,
                  nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum
                  iure reprehenderit qui in ea voluptate velit esse quam nihil
                  molestiae consequatur, vel illum qui dolorem eum fugiat quo
                  voluptas nulla pariatur.
                </p>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <div className="mb-3">
                  <span>Last update: 05/25/2018</span>
                </div>
                <div className="mb-1">
                  <strong>1. Our Policy</strong>
                </div>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
                  quia voluptas sit aspernatur aut odit aut fugit, sed quia
                  consequuntur magni dolores eos qui ratione voluptatem sequi
                  nesciunt. Neque porro quisquam est, qui dolorem ipsum quia
                  dolor sit amet, consectetur, adipisci velit, sed quia non
                  numquam eius modi tempora incidunt ut labore et dolore magnam
                  aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
                  nostrum exercitationem ullam corporis suscipit laboriosam,
                  nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum
                  iure reprehenderit qui in ea voluptate velit esse quam nihil
                  molestiae consequatur, vel illum qui dolorem eum fugiat quo
                  voluptas nulla pariatur.
                </p>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Container>
    );
  }
}

LegalTermsPage.propTypes = {
  location: PropTypes.object,
};

export default LegalTermsPage;
