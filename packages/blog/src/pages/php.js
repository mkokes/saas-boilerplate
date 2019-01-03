import React from "react";
import Layout from "../components/layout";
import Header from "../components/header";
import Footer from "../components/footer";
import dependabotLogo from "../images/dependabot-logo-square.svg";
import iconPHP from "../images/icon-php.svg";

const PHPPage = () => (
  <Layout>
    <div className="main-background">
      <Header>
        <div className="section hero">
          <div className="language-hero">
            <img src={dependabotLogo} alt="Dependabot" />
            <img src={iconPHP} alt="PHP" />
          </div>
          <h2>Dependabot for PHP</h2>
          <p>
            Dependabot creates pull requests to keep your PHP dependencies
            up-to-date.
          </p>
        </div>
      </Header>

      <div className="container">
        <div className="section">
          <h2>Features</h2>
          <p>
            Dependabot has supported PHP since June 2017. As well as
            Dependabot's <a href="/#features">core features</a> our PHP support
            has:
          </p>
          <div className="feature-boxes">
            <div className="feature-box">
              <div className="feature-description">
                <h3>Version conflicts taken care of</h3>
                <p>
                  Dependabot considers resolvability when determining available
                  version updates. Dependabot PRs will always resolve for your
                  composer.json file.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-description">
                <h3>Support for git sources and custom registries</h3>
                <p>
                  As well as using the main packagist registry, Dependabot can
                  handle git sources, custom registries (like packagist), and
                  private registry setups.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-description">
                <h3>Flexible monorepo support</h3>
                <p>
                  Using a monorepo? No problem - you can specify one or many
                  directories within a repo for Dependabot to look for
                  dependency files in.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-description">
                <h3>Custom branches and labels</h3>
                <p>
                  By default, Dependabot will create PRs against your default
                  branch and label them with "dependencies". Want to use a
                  different branch or label? No problem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </Layout>
);

export default PHPPage;
