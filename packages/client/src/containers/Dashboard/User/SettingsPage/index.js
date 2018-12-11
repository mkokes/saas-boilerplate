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
  font-size: 14px;
  font-weight: 600;
  line-height: 1.9em;
  color: #5a5f6d;
  margin-bottom: -5px;
`;
const SectionLabelText = styled.p`
  font-size: 14px;
  line-height: 1.4;
  color: #5a5f6d;
  font-weight: normal;
`;
const ProfileAvatarPreview = styled.div`
  float: left;
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
          <legend>User Profile</legend>
          <Row className="align-items-center">
            <Col xs="12" sm="12" md="12" lg="6">
              <Row>
                <Col xs="auto">
                  <ProfileAvatarPreview>
                    <Avatar
                      width="50"
                      height="50"
                      src="https://res.cloudinary.com/coinbase/image/upload/c_fill,h_150,w_150/q8x14xbptmjcusxmolwl"
                    />
                  </ProfileAvatarPreview>
                </Col>
                <Col xs="auto">
                  <SectionLabel>Change Avatar</SectionLabel>
                  <SectionLabelText>Max file size is 20Mb.</SectionLabelText>
                </Col>
                <Col className="d-flex align-items-center" xs="1">
                  <Button disabled>Upload</Button>
                </Col>
              </Row>
            </Col>
            <Col xs="12" sm="12" md="12" lg="6">
              <Row>
                <Col xs="6" sm="auto">
                  <SectionLabel>Change Password</SectionLabel>
                  <SectionLabelText>@TODO</SectionLabelText>
                </Col>
                <Col className="d-flex align-items-center" xs="6">
                  <Button disabled>Change Password</Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <hr />
        </Container>
      </Fragment>
    );
  }
}

SettingsPage.propTypes = {};
