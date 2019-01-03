import React from "react";
import { ReactComponent as IconGitMerge } from "../../images/git-merge.svg";
import { ReactComponent as IconGitPullRequest } from "../../images/git-pull-request.svg";
import { ReactComponent as IconRepoForked } from "../../images/repo-forked.svg";

const TableRow = ({ attributes }) => (
  <tr>
    <td>
      <a href={attributes["github-url"]}>{attributes["repo-name"]}</a>
      {attributes["forked"] && (
        <span
          style={{
            marginLeft: 5,
            verticalAlign: "middle"
          }}
          title="Forked repo"
        >
          <IconRepoForked className="u-fillRepoForked" />
        </span>
      )}
    </td>
    <td>
      <span
        style={{
          color: "white",
          padding: "3px 8px 5px",
          borderRadius: 3,
          fontSize: "0.8rem",
          fontWeight: 400
        }}
        className={
          {
            open: "u-backgroundColorPrOpen",
            closed: "u-backgroundColorPrClosed",
            merged: "u-backgroundColorPrMerged"
          }[attributes["current-state"]]
        }
      >
        <span
          style={{
            marginRight: 7,
            verticalAlign: "sub"
          }}
        >
          {(attributes["current-state"] === "open" ||
            attributes["current-state"] === "closed") && (
            <IconGitPullRequest className="u-fillWhite" />
          )}
          {attributes["current-state"] === "merged" && (
            <IconGitMerge className="u-fillWhite" />
          )}
        </span>
        {attributes["current-state"]}
      </span>
      {attributes["edited"] && (
        <span
          style={{
            fontSize: "0.8rem",
            marginLeft: 5,
            fontStyle: "italic"
          }}
          title="This PR has a non-Dependabot commit in it"
        >
          edited
        </span>
      )}
    </td>
  </tr>
);

const FailedPullRequests = ({ data }) => (
  <div className="container">
    <div className="section" style={{ marginTop: -70 }}>
      <h2>Failing pull request updates</h2>

      <p style={{ marginBottom: 25, marginTop: -10 }}>
        The following updates failed CI and contributed to the score.
      </p>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map(pr => {
            const { attributes, id } = pr;
            return <TableRow key={id} attributes={attributes} />;
          })}
        </tbody>
      </table>

      <p style={{ fontSize: "0.8rem", fontStyle: "italic" }}>
        Private repos are excluded from this list.
      </p>
    </div>
  </div>
);

export default FailedPullRequests;
