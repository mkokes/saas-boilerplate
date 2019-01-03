import React from "react";
import qs from "qs";
import Layout from "../components/layout";
import Footer from "../components/footer";
import SpecificUpdate from "../components/compatibility-score/specific-update";
import SpecificTarget from "../components/compatibility-score/specific-target";
import AllUpdates from "../components/compatibility-score/all-updates";
import FailedPullRequests from "../components/compatibility-score/failed-pull-requests";
import HowItWorks from "../components/compatibility-score/how-it-works";

class CompatibilityScorePage extends React.Component {
  state = { params: {}, compatibilityScores: null, failedPullRequests: null };

  componentDidMount() {
    const { location } = this.props;
    const queryParams = qs.parse(location.search, {
      ignoreQueryPrefix: true,
      strictNullHandling: true
    });
    const params = {
      dependencyName: queryParams["dependency-name"],
      packageManager: queryParams["package-manager"],
      versionScheme: queryParams["version-scheme"],
      previousVersion: queryParams["previous-version"],
      newVersion: queryParams["new-version"]
    };

    // If we're hitting the page with no expectations, let's show the semver
    // compatibility for a common dependency
    if (
      !params.previousVersion &&
      !params.newVersion &&
      !params.dependencyName &&
      !params.packageManager
    ) {
      const popularDependencies = [
        ["uglifier", "bundler"],
        ["sinatra", "bundler"],
        ["rubocop", "bundler"],
        ["rails", "bundler"],
        ["puma", "bundler"],
        ["webpack", "npm_and_yarn"],
        ["eslint", "npm_and_yarn"],
        ["react", "npm_and_yarn"],
        ["jest", "npm_and_yarn"],
        ["django", "pip"],
        ["pytest", "pip"],
        ["boto3", "pip"]
      ];
      const dep =
        popularDependencies[
          Math.floor(Math.random() * popularDependencies.length)
        ];
      params.dependencyName = dep[0];
      params.packageManager = dep[1];
    }

    this.setState({ params });

    this.fetchCompatibilityScores(params);

    if (params.newVersion) {
      this.fetchFailingPullRequests(params);
    }
  }

  fetchCompatibilityScores(params) {
    const query = qs.stringify(
      {
        "dependency-name": params.dependencyName,
        "package-manager": params.packageManager,
        "version-scheme": "semver"
      },
      { strictNullHandling: true }
    );

    const apiUlr = `${process.env.API_URL}/compatibility_scores?${query}`;

    fetch(apiUlr)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ compatibilityScores: data });
      });
  }

  fetchFailingPullRequests(params) {
    const failingPullRequestParams = {
      "dependency-name": params.dependencyName,
      "package-manager": params.packageManager,
      "target-version": params.newVersion
    };

    if (params.previousVersion) {
      failingPullRequestParams["previous-version"] = params.previousVersion;
    } else {
      failingPullRequestParams["version-scheme"] = "semver";
    }

    const query = qs.stringify(failingPullRequestParams, {
      strictNullHandling: true
    });
    const apiUrl = `${process.env.API_URL}/failing_pull_requests?${query}`;

    fetch(apiUrl)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ failedPullRequests: data });
      });
  }

  render() {
    const { params, failedPullRequests } = this.state;

    return (
      <Layout>
        <div className="main-background">
          {this.mainSection()}
          {failedPullRequests &&
          failedPullRequests.data &&
          failedPullRequests.data.length ? (
            <FailedPullRequests {...params} data={failedPullRequests} />
          ) : null}
          <HowItWorks />
          <Footer />
        </div>
      </Layout>
    );
  }

  mainSection() {
    const { params, compatibilityScores } = this.state;

    if (params.previousVersion && params.newVersion) {
      return <SpecificUpdate {...params} data={compatibilityScores} />;
    }

    if (params.newVersion) {
      return <SpecificTarget {...params} data={compatibilityScores} />;
    }

    return <AllUpdates {...params} data={compatibilityScores} />;
  }
}

export default CompatibilityScorePage;
