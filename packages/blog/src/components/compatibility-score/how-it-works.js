import React from "react";
import iconCheckForUpdates from "../../images/icon-check-for-updates.svg";
import iconOpenPrs from "../../images/icon-open-prs.svg";
import iconReviewAndMerge from "../../images/icon-review-and-merge.svg";

const HowItWorks = () => (
  <div className="container">
    <div className="section how-it-works" style={{ marginTop: -50 }}>
      <h2 id="how-it-works">How the score is calculated</h2>
      <div className="how-it-works-boxes">
        <div className="how-it-works-box">
          <div className="how-it-works-icon">
            <span className="floating-number">1</span>
            <img src={iconOpenPrs} />
          </div>
          <div className="how-it-works-description">
            <h3>We update hundreds of apps</h3>
            <p>
              When a new dependency version is released, Dependabot creates
              similar pull requests for hundreds of repos.
            </p>
          </div>
        </div>
        <div className="how-it-works-box">
          <div className="how-it-works-icon">
            <span className="floating-number">2</span>
            <img src={iconCheckForUpdates} />
          </div>
          <div className="how-it-works-description">
            <h3>We listen for the test results</h3>
            <p>
              For each repo with CI enabled and a previously passing test suite,
              we learn whether the update breaks any tests.
            </p>
          </div>
        </div>
        <div className="how-it-works-box">
          <div className="how-it-works-icon">
            <span className="floating-number">3</span>
            <img src={iconReviewAndMerge} />
          </div>
          <div className="how-it-works-description">
            <h3>We show you the pass rate</h3>
            <p>
              The compatibility score is the percentage of CI runs that passed
              when updating between relevant versions.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HowItWorks;
