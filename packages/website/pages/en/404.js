const React = require('react');
// const siteConfig = require(`${process.cwd()}/siteConfig.js`);

class ErrorPage extends React.Component {
  render() {
    return (
      <div className="error-page">
        <div className="error-page-container">
          <span>404 </span>
          <p>Page Not Found.</p>
          <a href="/">Return to the front page</a>
        </div>
      </div>
    );
  }
}

ErrorPage.title = 'Page Not Found';

module.exports = ErrorPage;
