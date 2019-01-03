import React from "react";
import { find } from "lodash";
import Header from "../../components/header";
import Score from "./score";

class SpecificTarget extends React.Component {
  render() {
    const { dependencyName, data } = this.props;
    let { newVersion } = this.props;

    if (newVersion === "latest") {
      newVersion = data ? data.latest_version : "...";
    }

    return (
      <Header>
        <div className="section compatibility-score-container">
          <h2>
            <span className="page-title-prefix">
              SemVer stability score for{" "}
            </span>
            <span className="repo-name">{dependencyName}</span>
          </h2>
          <h3 className="subtitle-version">{newVersion}</h3>

          {this.compatibilityBoxes()}
        </div>
      </Header>
    );
  }

  compatibilityBoxes() {
    const { dependencyName, packageManager, newVersion, data } = this.props;

    if (!data) {
      return <p>Loading...</p>;
    }

    const scoreProps = { dependencyName, packageManager, newVersion };

    return (
      <div className="compatibility-boxes">
        <div className="compatibility-box compatibility-scores">
          <Score {...scoreProps} className="primary" />
        </div>

        <div className="compatibility-box compatibility-blurb">
          {this.blurb()}
          <p>
            Projects without CI, or without a previously passing test suite, are
            excluded from the scores. <span className="semver-score-caveat" />
          </p>
          <p>
            Dependabot creates pull requests for thousands of organisations to
            help them keep their dependencies up to date.
          </p>
        </div>
      </div>
    );
  }

  blurb() {
    const { dependencyName, data } = this.props;
    let { newVersion } = this.props;
    if (newVersion === "latest") {
      newVersion = data ? data.latest_version : "...";
    }
    const update = find(data.semver_updates, { updated_version: newVersion });

    if (!update || update.candidate_updates < 5) {
      return (
        <p>
          Dependabot hasn't made enough updates for projects migrating{" "}
          <strong>{dependencyName}</strong> to <strong>{newVersion}</strong> to
          form a view on compatibility yet.
        </p>
      );
    }

    return (
      <p>
        Dependabot has updated <strong>{dependencyName}</strong> to{" "}
        <strong>{newVersion}</strong> from a SemVer compatible version{" "}
        <strong>{update.candidate_updates}</strong> times so far.
        <br />
        <strong>
          {semverScore(update.candidate_updates, update.successful_updates)}%
        </strong>{" "}
        of those updates passed CI.
      </p>
    );
  }
}

function semverScore(total, successful) {
  return Math.round((100.0 * successful) / total);
}

export default SpecificTarget;
