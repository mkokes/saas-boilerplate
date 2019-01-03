import React from "react";
import qs from "qs";

const CompatibilityScore = ({ className, footer, ...props }) => {
  const baseUrl = window.location.href.split("?")[0];
  const allUrl = `${baseUrl}?${qs.stringify(
    {
      "dependency-name": props.dependencyName,
      "package-manager": props.packageManager,
      "version-scheme": "semver"
    },
    { strictNullHandling: true }
  )}`;
  return (
    <div className={`compatibility-score ${className || ""}`}>
      {props.enableLink ? <LinkedBadge {...props} /> : <Badge {...props} />}

      <div className="compatibility-score-footer">
        {footer ? (
          footer
        ) : (
          <div className="compatibility-score-version">
            <a href={allUrl}>
              See scores for all releases of {props.dependencyName}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const Badge = props => (
  <div className="compatibility-score-badge">
    <BadgeImage {...props} />
  </div>
);

const LinkedBadge = props => (
  <a
    href={compatibilityScoreUrl(
      props.dependencyName,
      props.packageManager,
      props.newVersion,
      props.previousVersion
    )}
    className="compatibility-score-badge"
  >
    <BadgeImage {...props} />
  </a>
);

const BadgeImage = props => (
  <img
    alt="Compatibility score"
    src={compatibilityBadgeUrl(
      props.dependencyName,
      props.packageManager,
      props.newVersion,
      props.previousVersion
    )}
  />
);

function compatibilityBadgeUrl(
  dependencyName,
  packageManager,
  newVersion,
  previousVersion
) {
  let params = {
    "dependency-name": dependencyName,
    "package-manager": packageManager
  };

  // If we're not supplying versions, get a badge for the entire dependency history
  // Otherwise, get a badge for just the version bump we care about
  if (previousVersion && newVersion) {
    params = {
      ...params,
      "previous-version": previousVersion,
      "new-version": newVersion
    };
  } else if (newVersion) {
    params = {
      ...params,
      "target-version": newVersion,
      "version-scheme": "semver"
    };
  } else {
    params = { ...params, "version-scheme": "semver" };
  }

  const query = qs.stringify(params, { strictNullHandling: true });
  return `${process.env.API_URL}/badges/compatibility_score?${query}`;
}

function compatibilityScoreUrl(
  dependencyName,
  packageManager,
  newVersion,
  previousVersion
) {
  let params = {
    "dependency-name": dependencyName,
    "package-manager": packageManager,
    "previous-version": previousVersion,
    "new-version": newVersion
  };
  const baseUrl = window.location.href.split("?")[0];
  const query = qs.stringify(params, { strictNullHandling: true });
  return `${baseUrl}?${query}`;
}

export default CompatibilityScore;
