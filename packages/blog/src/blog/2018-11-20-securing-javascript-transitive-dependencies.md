---
layout: post
title:  "Securing JavaScript transitive dependencies"
date:   2018-11-20 11:00:00 +0100
---

Dependabot can now update both Yarn and npm transitive dependencies in response to
security advisories for Node packages.

This massively decreases the surface area for security vulnerabilities. The average JavaScript project added to Dependabot has 533 transitive dependencies vs. 26 top-level dependencies.

Previously, Dependabot would only keep your top-level dependencies secure and
up-to-date.

Here's how it works:
- Dependabot polls [The Node Security Working Group's database](node-sec) and [GitHub Security Advisory API](github-sec), looking for new advisories
- If it finds any, Dependabot tries to update that specific dependency to the
  latest version allowed by its parents, creating a lockfile-only change
- Dependabot creates individual PRs for each insecure sub dependency. Each PR
  will include details of the vulnerabilities fixed

Stay safe 🚇

[node-sec]: https://github.com/nodejs/security-wg
[github-sec]: https://blog.github.com/category/announcements/#github-security-advisory-api
