import React from "react";
import Layout from "../components/layout";
import Header from "../components/header";
import Footer from "../components/footer";
import dependabotLogo from "../images/dependabot-logo-square.svg";
import iconGo from "../images/icon-go.svg";

const GoPage = () => (
  <Layout>
    <div className="main-background">
      <Header>
        <div className="section hero">
          <div className="language-hero">
            <img src={dependabotLogo} alt="Dependabot" />
            <img src={iconGo} alt="Go" />
          </div>
          <h2>Dependabot for Go</h2>
          <p>
            Dependabot creates pull requests to keep your Go dependencies
            up-to-date.
          </p>
        </div>
      </Header>

      <div className="container">
        <div className="section">
          <h2>Features</h2>
          <p>
            Go is one of Dependabot's newest languages and is currently in
            alpha. Alongside Dependabot's <a href="/#features">core features</a>
            we already have support for:
          </p>
          <div className="feature-boxes">
            <div className="feature-box">
              <div className="feature-description">
                <h3>Support for go.mod and dep</h3>
                <p>
                  Dependabot will determine whether you're using go modules or
                  dep and update your dependency files accordingly. It can even
                  handle projects using both.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-description">
                <h3>Version conflicts taken care of</h3>
                <p>
                  Dependabot considers resolvability when determining available
                  version updates. If you're using dep, Dependabot PRs will
                  always resolve for your Gopkg.toml.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-description">
                <h3>Flexible monorepo support</h3>
                <p>
                  Using a monorepo? No problem - you can specify one or many
                  directories within a repo for Dependabot to look for project
                  in.
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

export default GoPage;
