import React from "react";
import { find } from "lodash";
import Header from "../../components/header";
import Score from "./score";

class SpecificUpdate extends React.Component {
  render() {
    const { dependencyName, previousVersion, newVersion } = this.props;
    return (
      <Header>
        <div className="section compatibility-score-container">
          <h2>
            <span className="page-title-prefix">Compatibility score for </span>
            <span className="repo-name">{dependencyName}</span>
          </h2>
          <h3 className="subtitle-version">
            {previousVersion} ... {newVersion}
          </h3>

          {this.compatibilityBoxes()}
        </div>
      </Header>
    );
  }

  compatibilityBoxes() {
    if (!this.props.data) {
      return <p>Loading...</p>;
    }

    return (
      <div className="compatibility-boxes">
        <div className="compatibility-box compatibility-scores">
          <Score {...this.props} className="primary" />
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
    const { dependencyName, previousVersion, newVersion, data } = this.props;
    const update = find(data.updates, {
      previous_version: previousVersion,
      updated_version: newVersion
    });

    if (!update || update.candidate_updates < 5) {
      return (
        <p>
          Dependabot hasn't made enough updates for projects migrating{" "}
          <strong>{dependencyName}</strong> from{" "}
          <strong>{previousVersion}</strong> to <strong>{newVersion}</strong> to
          form a view on compatibility yet.
        </p>
      );
    }

    return (
      <p>
        Dependabot has updated <strong>{dependencyName}</strong> from{" "}
        <strong>{previousVersion}</strong> to <strong>{newVersion}</strong> in{" "}
        <strong>{update.candidate_updates}</strong> projects so far.{" "}
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

export default SpecificUpdate;
