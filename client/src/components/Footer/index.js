/**
 *
 * Footer
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  Container,
  Segment,
  Grid,
  List as ListDefault,
} from 'semantic-ui-react';

/* const Footer = styled.footer`
  position: relative;
  line-height: 34px;
  bottom: 0;
  width: 100%;
`; */

const FooterElement = styled(Segment)`
  &&& {
    padding-top: 3em;
    padding-bottom: 3em;
    background-color: rgb(35, 49, 67);
  }
`;
const ListColumn = styled(Grid.Column)`
  &&& {
    display: flex !important;
    justify-content: center;
  }
`;
const List = styled(ListDefault)`
  &&& {
    margin-bottom: 16px;
  }
`;
const ListHeader = styled(List.Header)`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
`;
const ListItem = styled(List.Item)`
  font-size: 16px;

  a {
    color: rgba(255, 255, 255, 0.5);
  }
  a:hover {
    color: #ffffff;
    text-decoration: underline;
  }
`;

/* eslint-disable react/prefer-stateless-function */
class Footer extends React.PureComponent {
  render() {
    return (
      <FooterElement vertical inverted>
        <Container>
          <Grid centered columns={5}>
            <ListColumn mobile={8} tablet={3} computer={3}>
              <List>
                <ListHeader>Product</ListHeader>
                <ListItem>
                  <Link to="/pricing">Pricing</Link>
                </ListItem>
                <ListItem>
                  <Link to="/signup">Sign up</Link>
                </ListItem>
                <ListItem>
                  <Link to="/auth/login">Log in</Link>
                </ListItem>
              </List>
            </ListColumn>
            <ListColumn mobile={8} tablet={3} computer={3}>
              <List>
                <ListHeader>Resources</ListHeader>
                <ListItem>
                  <Link to="/support">Support</Link>
                </ListItem>
                <ListItem>
                  <Link to="/blog">Blog</Link>
                </ListItem>
                <ListItem>
                  <Link to="/legal">Legal</Link>
                </ListItem>
              </List>
            </ListColumn>
            <ListColumn mobile={8} tablet={3} computer={3}>
              <List>
                <ListHeader>Developers</ListHeader>
                <ListItem>
                  <Link to="https://status.domain.io">Status page</Link>
                </ListItem>
                <ListItem>
                  <Link to="https://docs.domain.io">API documentation</Link>
                </ListItem>
              </List>
            </ListColumn>
            <ListColumn mobile={8} tablet={3} computer={3}>
              <List>
                <ListHeader>Company</ListHeader>
                <ListItem>
                  <Link to="/about">About</Link>
                </ListItem>
                <ListItem>
                  <Link to="/contact">Contact us</Link>
                </ListItem>
              </List>
            </ListColumn>
          </Grid>
          <Grid columns={2}>
            <Grid.Column width={12}>
              {' '}
              <span>® {new Date().getFullYear()} ACME Company Inc.</span>
            </Grid.Column>
            <Grid.Column textAlign="right" width={4}>
              <img src="/logo.png" alt="logo" width="26" height="26" />
            </Grid.Column>
          </Grid>
        </Container>
      </FooterElement>
    );
  }
}

Footer.propTypes = {};

export default Footer;
