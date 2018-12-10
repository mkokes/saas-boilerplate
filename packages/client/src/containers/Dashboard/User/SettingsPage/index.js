/**
 *
 * SettingsPage
 *
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Container, Button } from 'reactstrap';
import styled from 'styled-components';

import Avatar from 'components/Avatar';

const SectionLabel = styled.p`
  font-weight: 600;
  line-height: 1.9em;
  color: #5a5f6d;
  margin-bottom: -5px;
`;
const ProfileAvatarPreview = styled.span`
  float: left;
  margin: 10px 30px 0 15px;
  max-width: 50px;
  max-height: 50px;
  border-radius: 6px;
`;

/* eslint-disable react/prefer-stateless-function */
export default class SettingsPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>User Settings</title>
          <meta name="description" content="Description of User Settings" />
        </Helmet>
        <Container tag="main">
          <div>
            <legend>User Profile</legend>
            <Row>
              <Col sm="12" md="12" lg="6">
                <Row className="align-items-center">
                  <Col xs="3" md="2">
                    <ProfileAvatarPreview>
                      <Avatar
                        width="50"
                        height="50"
                        src="https://res.cloudinary.com/coinbase/image/upload/c_fill,h_150,w_150/q8x14xbptmjcusxmolwl"
                      />
                    </ProfileAvatarPreview>
                  </Col>
                  <Col xs="auto" md="auto" lg="auto">
                    <div>
                      <SectionLabel>Change Avatar</SectionLabel>
                      <small className="text-muted">
                        Max file size is 20Mb.
                      </small>
                    </div>
                  </Col>
                  <Col className="d-flex align-items-center" xs="2">
                    <Button disabled>Upload</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Container>
      </Fragment>
    );
  }
}

SettingsPage.propTypes = {};
