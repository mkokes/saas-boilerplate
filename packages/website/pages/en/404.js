const React = require('react');
// const siteConfig = require(`${process.cwd()}/siteConfig.js`);

const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;

class ErrorPage extends React.Component {
  render() {
    return (
      <Container className="error-page">
        <span>404 </span>
        <p>Page Not Found.</p>
        <a href="/">Return to the front page</a>
      </Container>
    );
  }
}

ErrorPage.title = 'Page Not Found';

module.exports = ErrorPage;
