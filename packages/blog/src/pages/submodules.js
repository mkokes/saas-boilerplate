import React from "react";
import Layout from "../components/layout";
import Header from "../components/header";
import Footer from "../components/footer";
import dependabotLogo from "../images/dependabot-logo-square.svg";
import iconSubmodules from "../images/icon-git.svg";
import iconOpenPrs from "../images/icon-open-prs.svg";
import iconCheckForUpdates from "../images/icon-check-for-updates.svg";
import iconReviewAndMerge from "../images/icon-review-and-merge.svg";

const SubmodulesPage = () => (
  <Layout>
    <div className="main-background">
      <Header>
        <div className="section hero">
          <div className="language-hero">
            <img src={dependabotLogo} alt="Dependabot" />
            <img src={iconSubmodules} alt="Git Submodules" />
          </div>
          <h2>Dependabot for Git Submodules</h2>
          <p>
            Dependabot creates pull requests to keep your git submodules
            up-to-date.
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
                <h3>Dependabot fetches your gitmodules file</h3>
                <p>
                  Every day, Dependabot pulls down your gitmodules file and the
                  commit SHA for each submodule.
                </p>
              </div>
            </div>
            <div className="how-it-works-box">
              <div className="how-it-works-icon">
                <span className="floating-number">2</span>
                <img src={iconCheckForUpdates} />
              </div>
              <div className="how-it-works-description">
                <h3>Dependabot checks each submodule's commit</h3>
                <p>
                  For each submodule, Dependabot fetches the latest commit SHA
                  for the specified branch.
                </p>
              </div>
            </div>
            <div className="how-it-works-box">
              <div className="how-it-works-icon">
                <span className="floating-number">3</span>
                <img src={iconReviewAndMerge} />
              </div>
              <div className="how-it-works-description">
                <h3>Dependabot creates PRs for outdated submodules</h3>
                <p>
                  If new commits exist for any of your submodules, Dependabot
                  opens a PR with the new commit SHA.
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
            support for submodules has:
          </p>
          <div className="feature-boxes">
            <div className="feature-box">
              <div className="feature-description">
                <h3>Flexible monorepo support</h3>
                <p>
                  Using a monorepo? No problem - you can specify one or many
                  directories within a repo for Dependabot to look for
                  gitmodules files in.
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

export default SubmodulesPage;
