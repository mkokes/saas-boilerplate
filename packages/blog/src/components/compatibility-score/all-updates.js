import React from "react";
import { takeRight, reverse } from "lodash";
import Header from "../../components/header";
import Score from "./score";

class AllUpdates extends React.Component {
  state = { updatesToShow: 3 };

  render() {
    const { dependencyName } = this.props;

    return (
      <Header>
        <div className="section compatibility-score-container">
          <h2>
            <span className="page-title-prefix">
              SemVer stability score for{" "}
            </span>
            <span className="repo-name">{dependencyName}</span>
          </h2>

          {this.compatibilityBoxes()}
        </div>
      </Header>
    );
  }

  compatibilityBoxes() {
    const { dependencyName, packageManager, data } = this.props;

    if (!data) {
      return <p>Loading...</p>;
    }

    const scoreProps = { dependencyName, packageManager };

    return (
      <div className="compatibility-boxes">
        <div className="compatibility-box compatibility-scores">
          <Score
            {...scoreProps}
            className="primary"
            footer="All SemVer compatible releases"
          />
          {this.recentUpdates()}
          <span className="compatibility-scores-more-link">
            <a onClick={this.showMoreUpdates.bind(this)} href>
              ...see more
            </a>
          </span>
        </div>

        <div className="compatibility-box compatibility-blurb">
          {this.blurb()}
          <p>
            Projects without CI, or without a previously passing test suite, are
            excluded from the scores. SemVer incompatible updates are excluded
            from the overall SemVer score.
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

    if (data.total_semver_compatible_updates < 5) {
      return (
        <p>
          Dependabot hasn't made enough SemVer compatible updates for{" "}
          <strong>{dependencyName}</strong> to form a view on its compatibility
          yet.
        </p>
      );
    }

    const score = semverScore(
      data["total_semver_compatible_updates"],
      data["successful_semver_compatible_updates"]
    );
    return (
      <p>
        Dependabot has updated <strong>{dependencyName}</strong> between SemVer
        compatible versions{" "}
        <strong>{data.total_semver_compatible_updates}</strong> times across{" "}
        <strong>{data.total_projects_with_semver_compatible_updates}</strong>{" "}
        projects so far.
        <br />
        <strong>{score}%</strong> of those updates passed CI.
      </p>
    );
  }

  recentUpdates() {
    const { dependencyName, packageManager, data } = this.props;

    const mostRecentUpdates = takeRight(
      data.single_version_updates,
      this.state.updatesToShow
    );
    return reverse(mostRecentUpdates).map(update => (
      <Score
        key={update.updated_version}
        dependencyName={dependencyName}
        packageManager={packageManager}
        newVersion={update.updated_version}
        previousVersion={update.previous_version}
        footer={update.previous_version + " → " + update.updated_version}
        enableLink={true}
      />
    ));
  }

  showMoreUpdates() {
    this.setState(lastState => ({
      updatesToShow: lastState.updatesToShow + 3
    }));
  }
}

function semverScore(total, successful) {
  return Math.round((100.0 * successful) / total);
}

export default AllUpdates;
