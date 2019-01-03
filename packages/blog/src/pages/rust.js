import React from "react";
import Layout from "../components/layout";
import Header from "../components/header";
import Footer from "../components/footer";
import dependabotLogo from "../images/dependabot-logo-square.svg";
import iconRust from "../images/icon-rust.svg";

const RustPage = () => (
  <Layout>
    <div className="main-background">
      <Header>
        <div className="section hero">
          <div className="language-hero">
            <img src={dependabotLogo} alt="Dependabot" />
            <img src={iconRust} alt="Rust" />
          </div>
          <h2>Dependabot for Rust</h2>
          <p>
            Dependabot creates pull requests to keep your Rust dependencies
            up-to-date.
          </p>
        </div>
      </Header>

      <div className="container">
        <div className="section">
          <h2>Features</h2>
          <p>
            Rust is one of Dependabot's newest languages. We're still rapidly
            improving it, but alongside Dependabot's{" "}
            <a href="/#features">core features</a> it already has:
          </p>
          <div className="feature-boxes">
            <div className="feature-box">
              <div className="feature-description">
                <h3>Cargo.toml and lockfile updates</h3>
                <p>
                  Dependabot will propose updates to your Cargo.toml, as well as
                  your Cargo.lock. Alternatively, you can set Dependabot to only
                  make lockfile updates.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-description">
                <h3>Automatic vulnerability scanning</h3>
                <p>
                  Dependabot checks your dependencies against the RustSec
                  Advisory Database, and creates PRs immediately for any
                  vulnerable top-level or subdependencies.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-description">
                <h3>Support for git sources</h3>
                <p>
                  Dependabot can handle git sources, and will create PRs to keep
                  them pointing to the latest commit. For private git sources
                  you can enter credentials in your dashboard.
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

export default RustPage;
