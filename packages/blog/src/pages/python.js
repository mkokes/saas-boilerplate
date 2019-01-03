import React from "react";
import Layout from "../components/layout";
import Header from "../components/header";
import Footer from "../components/footer";
import dependabotLogo from "../images/dependabot-logo-square.svg";
import iconPython from "../images/icon-python.svg";

const PythonPage = () => (
  <Layout>
    <div className="main-background">
      <Header>
        <div className="section hero">
          <div className="language-hero">
            <img src={dependabotLogo} alt="Dependabot" />
            <img src={iconPython} alt="Python" />
          </div>
          <h2>Dependabot for Python</h2>
          <p>
            Dependabot creates pull requests to keep your Python dependencies
            up-to-date.
          </p>
        </div>
      </Header>

      <div className="container">
        <div className="section">
          <h2>Features</h2>
          <p>
            As well as Dependabot's <a href="/#features">core features</a> our
            Python support has:
          </p>
          <div className="feature-boxes">
            <div className="feature-box">
              <div className="feature-description">
                <h3>Pipenv, Poetry and pip-compile support</h3>
                <p>
                  Using Pipenv, Poetry or pip-tools? Dependabot can keep all
                  three's manifest and lockfiles up-to-date, as well as working
                  with plain old requirements.txt files.
                </p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-description">
                <h3>Support for git sources and custom indexes</h3>
                <p>
                  Dependabot can handle git sources and custom indexes. If you
                  come across a setup that we can't handle let us know and we'll
                  add support.
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

export default PythonPage;
