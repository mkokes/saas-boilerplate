import React from "react";
import Layout from "../components/layout";
import Header from "../components/header";
import Footer from "../components/footer";
import dependabotLogo from "../images/dependabot-logo-square.svg";
import iconElixir from "../images/icon-elixir.svg";

const ElixirPage = () => (
  <Layout>
    <div className="main-background">
      <Header>
        <div className="section hero">
          <div className="language-hero">
            <img src={dependabotLogo} alt="Dependabot" />
            <img src={iconElixir} alt="Elixir" />
          </div>
          <h2>Dependabot for Elixir</h2>
          <p>
            Dependabot creates pull requests to keep your Elixir dependencies
            up-to-date.
          </p>
        </div>
      </Header>

      <div className="container">
        <div className="section">
          <h2>Features</h2>
          <p>
            Elixir is one of Dependabot's best supported languages. Alongside
            Dependabot's <a href="/#features">core features</a> it has:
          </p>
          <div className="feature-boxes">
            <div className="feature-box">
              <div className="feature-description">
                <h3>Version conflicts taken care of</h3>
                <p>
                  Dependabot considers resolvability when determining available
                  version updates. Dependabot PRs will always resolve for your
                  mix.exs.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-description">
                <h3>Mixfile requirement updates</h3>
                <p>
                  Dependabot will propose updates to your Mixfile, as well as
                  your mixfile.lock. Alternatively, you can set Dependabot to
                  only make lockfile updates.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-description">
                <h3>Support for git sources and private packages</h3>
                <p>
                  Dependabot can handle private packages and organisations, with
                  a secure way for you to provide credentials. It also works
                  with git sources, private or otherwise.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-description">
                <h3>Automatic vulnerability scanning</h3>
                <p>
                  Dependabot checks your dependencies against the Elixir
                  Advisory Database, and creates PRs immediately for any
                  vulnerable top-level or subdependencies.
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

export default ElixirPage;
