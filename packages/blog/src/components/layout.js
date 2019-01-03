import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

import "normalize.css";
import "../scss/main.scss";
import "../scss/utils.scss";
import favicon from "../images/favicon.ico";

const Layout = ({ children }) => (
  <div>
    <Helmet
      title="Dependabot"
      meta={[
        {
          name: "description",
          content:
            "Automated dependency updates for your Ruby, Python, JavaScript, PHP, .NET, Go, Elixir, Rust, Java and Elm."
        },
        {
          name: "keywords",
          content: "dependencies, update, npm, yarn, bundler, pip, composer"
        }
      ]}
      link={[{ rel: "shortcut icon", type: "image/png", href: `${favicon}` }]}
    />
    {children}
  </div>
);

Layout.propTypes = {
  children: PropTypes.func
};

export default Layout;
