import React from "react";
import Layout from "../components/layout";
import Header from "../components/header";
import Footer from "../components/footer";
import dependabotLogo from "../images/dependabot-logo-square.svg";
import iconJavascript from "../images/icon-js.svg";

const JavascriptPage = () => (
  <Layout>
    <div className="main-background">
      <Header>
        <div className="section hero">
          <div className="language-hero">
            <img src={dependabotLogo} alt="Dependabot" />
            <img src={iconJavascript} alt="JavaScript" />
          </div>
          <h2>Dependabot for JavaScript</h2>
          <p>
            Dependabot creates pull requests to keep your JavaScript
            dependencies up-to-date.
          </p>
        </div>
      </Header>
      <div className="container">
        <div className="section">
          <h2>Features</h2>
          <p>
            As well as Dependabot's <a href="/#features">core features</a> our
            JavaScript support has:
          </p>
          <div className="feature-boxes">
            <div className="feature-box">
              <div className="feature-description">
                <h3>Yarn and npm5 lockfile support</h3>
                <p>
                  Dependabot works with lockfiles out of the box. It will
                  automatically detect whether you're using Yarn or npm5 and
                  keep the lockfile up-to-date.
                </p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-description">
                <h3>Support for git sources and custom registries</h3>
                <p>
                  Dependabot can handle git sources and custom registries,
                  including those that require authentication. You name it,
                  Dependabot supports it.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-description">
                <h3>Monorepo support, including Yarn workspaces</h3>
                <p>
                  Using a monorepo? Dependabot will pick up all your JS
                  dependency files automatically if you're using Yarn workspaces
                  or Lerna, or you can specify directories individually.
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

export default JavascriptPage;
