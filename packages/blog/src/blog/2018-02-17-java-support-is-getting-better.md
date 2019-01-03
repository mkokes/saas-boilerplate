---
layout: post
title:  "Dependabot's Java support is now in beta"
date:   2018-02-17 09:00:00 +0000
---

We released alpha [support for Java (Maven)][release-post] back in January.
Today, we're upgrading support to beta, with a plan for the additional
improvements we need to get Java to full release status. 🎉

Since launch, Dependabot users have merged over 100 Dependabot Java PRs across
19 different repos. With their help we've ironed out the integration's initial
bugs, fixed the way it updates the `pom.xml` to ensure it doesn't reformat it,
and yesterday shipped a big improvement to the way Dependabot handles versions
set using a property. It's those improvements that warrant the upgrade to beta
status.

From here, our target is to get Java support to full release status. To achieve
that we need our Java support to handle:
- **Range requirements in your POM**. Currently, Dependabot will ignore Java
  dependencies specified with a range requirement. It should instead create PRs
  that update the range to cover the latest version.
- **Dependency resolution**. Currently, Dependabot will create PRs that update
  you to the latest version of each of your dependencies without considering
  whether this version is resolvable in the context of your POM. It should
  instead create PRs to update you to the latest resolvable version.
- **Alternative repositories**. Currently, Dependabot will only query The
  Central Repository for dependencies. It should instead support any
  repositories specified in your POM.

If you use Maven we'd love to hear from you as we test support for it. If you
have any suggestions, or if you experience any issues, please don't hesitate to
[let us know][feedback-link]!

Enjoy!

🍸

[release-post]: ../announcing-maven-support
[feedback-link]: https://github.com/dependabot/feedback
