import React from "react";
import Layout from "../components/layout";
import Header from "../components/header";
import Footer from "../components/footer";
import dependabotLogo from "../images/dependabot-logo-square.svg";
import iconRuby from "../images/icon-ruby.svg";

const RubyPage = () => (
  <Layout>
    <div className="main-background">
      <Header>
        <div className="section hero">
          <div className="language-hero">
            <img src={dependabotLogo} alt="Dependabot" />
            <img src={iconRuby} alt="Ruby" />
          </div>
          <h2>Dependabot for Ruby</h2>
          <p>
            Dependabot creates pull requests to keep your Ruby dependencies
            up-to-date.
          </p>
        </div>
      </Header>

      <div className="container">
        <div className="section">
          <h2>Features</h2>
          <p>
            Ruby is one of our best supported languages. As well as Dependabot's{" "}
            <a href="/#features">core features</a> it has:
          </p>
          <div className="feature-boxes">
            <div className="feature-box">
              <div className="feature-description">
                <h3>Version conflicts taken care of</h3>
                <p>
                  Dependabot considers resolvability when determining available
                  version updates. Dependabot PRs will always resolve for your
                  Gemfile and Ruby version.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-description">
                <h3>Multi-dependency updates when required</h3>
                <p>
                  If updating to the latest version of a dependency requires
                  multiple dependencies to be updated at once then Dependabot
                  will propose a multi-dependency update.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-description">
                <h3>Support for git sources and private registries</h3>
                <p>
                  Dependabot can handle alternative gem sources, as well as the
                  main Rubygems registry. It even knows when a git commit you've
                  pinned to is included in a release.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-description">
                <h3>Gemfile and gemspec requirement updates</h3>
                <p>
                  Dependabot will propose updates to your Gemfile and/or
                  gemspec, as well as your Gemfile.lock. Alternatively, you can
                  set Dependabot to only make lockfile updates.
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

export default RubyPage;
