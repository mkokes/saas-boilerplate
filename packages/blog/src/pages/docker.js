import React from "react";
import Layout from "../components/layout";
import Header from "../components/header";
import Footer from "../components/footer";
import dependabotLogo from "../images/dependabot-logo-square.svg";
import iconDocker from "../images/icon-docker.svg";
import iconOpenPrs from "../images/icon-open-prs.svg";
import iconCheckForUpdates from "../images/icon-check-for-updates.svg";
import iconReviewAndMerge from "../images/icon-review-and-merge.svg";

const DockerPage = () => (
  <Layout>
    <div className="main-background">
      <Header>
        <div className="section hero">
          <div className="language-hero">
            <img src={dependabotLogo} alt="Dependabot" />
            <img src={iconDocker} alt="Docker" />
          </div>
          <h2>Dependabot for Docker</h2>
          <p>
            Dependabot creates pull requests to keep your Dockerfile up-to-date.
          </p>
        </div>
      </Header>

      <div className="container">
        <div className="section how-it-works">
          <a name="how-it-works" href />
          <h2>How it works</h2>
          <div className="how-it-works-boxes">
            <div className="how-it-works-box">
              <div className="how-it-works-icon">
                <span className="floating-number">1</span>
                <img src={iconOpenPrs} />
              </div>
              <div className="how-it-works-description">
                <h3>Dependabot fetches your Dockerfile</h3>
                <p>
                  Every day, Dependabot pulls down your Dockerfile and
                  identifies the base image it uses.
                </p>
              </div>
            </div>
            <div className="how-it-works-box">
              <div className="how-it-works-icon">
                <span className="floating-number">2</span>
                <img src={iconCheckForUpdates} />
              </div>
              <div className="how-it-works-description">
                <h3>Dependabot checks the base image is up-to-date</h3>
                <p>
                  Dependabot checks Docker hub, or your private registry, for
                  updates to your base image.
                </p>
              </div>
            </div>
            <div className="how-it-works-box">
              <div className="how-it-works-icon">
                <span className="floating-number">3</span>
                <img src={iconReviewAndMerge} />
              </div>
              <div className="how-it-works-description">
                <h3>Dependabot creates a PR if an update is available</h3>
                <p>
                  If an updated base image exist, Dependabot opens a PR to
                  upgrade your Dockerfile to use it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="section">
          <h2>Features</h2>
          <p>
            Alongside Dependabot's <a href="/#features">core features</a>, our
            support for Docker has:
          </p>
          <div className="feature-boxes">
            <div className="feature-box">
              <div className="feature-description">
                <h3>Flexible monorepo support</h3>
                <p>
                  Using a monorepo? No problem - you can specify one or many
                  directories within a repo for Dependabot to look for
                  Dockerfiles in.
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

export default DockerPage;
