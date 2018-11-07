/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Segment, Container, Header, Button, Divider } from 'semantic-ui-react';

const Main = styled.main`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

const IntroSegment = styled(Segment)`
  &&& {
    padding-top: 7em;
    padding-bottom: 7em;
    margin-bottom: 0px;
  }
`;
const ContentSegment = styled(Segment)`
  display: flex;
  flex-grow: 1;
  align-items: center;
`;

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Home Page</title>
          <meta
            name="description"
            content="A React.js Boilerplate application homepage"
          />
        </Helmet>
        <Main>
          <IntroSegment textAlign="center" inverted>
            <Container text>
              <Header as="h1" inverted>
                Intro title
              </Header>
              <Header as="h2" inverted>
                Make it short and sweet, but not too short so folks dont simply
                skip over it entirely.
              </Header>
              <Link to="/signup">
                <Button primary size="huge">
                  Sign up free
                </Button>
              </Link>
            </Container>
          </IntroSegment>
          <ContentSegment vertical>
            <Container text>
              <Header as="h3">Breaking The Grid, Grabs Your Attention</Header>
              <p>
                Instead of focusing on content creation and hard work, we have
                learned how to master the art of doing nothing by providing
                massive amounts of whitespace and generic content that can seem
                massive, monolithic and worth your attention.
              </p>
              <Button size="large">Read More</Button>
              <Divider horizontal>Case Studies</Divider>
              <Header as="h3">Did We Tell You About Our Bananas?</Header>
              <p>
                Yes I know you probably disregarded the earlier boasts as
                non-sequitur filler content, but its really true. It took years
                of gene splicing and combinatory DNA research, but our bananas
                can really dance.
              </p>
              <Button size="large">I am interested</Button>
            </Container>
          </ContentSegment>
        </Main>
      </Fragment>
    );
  }
}
