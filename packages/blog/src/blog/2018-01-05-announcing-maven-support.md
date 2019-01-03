---
layout: post
title:  "Announcing Maven support"
date:   2018-01-05 10:00:00 +0100
---

Using Maven? Dependabot can now help you keep your POM file up-to-date.

<p class="image-medium">
  <img alt="Java logo" height="100px" src="images/java-logo.svg">
</p>

Here's how it works:
- Dependabot looks for a "pom.xml" in your repo, and pulls it down.
- Dependabot extracts the dependencies from your POM file, and checks The
  Central Repository for any available updates.
- If any updates are available, Dependabot creates individual PRs for each of
  your outdated dependencies.

We wanted to launch Maven support as early as possible, so have released it
in alpha. As such, we currently **don't** support the following:
- **Range requirements in your POM**. Dependabot will ignore any dependencies
  you've specified to have a range requirement. In future, Dependabot will start
  creating PRs that update the range to cover the latest version.
- **Dependency resolution**. Dependabot will create PRs that update you to
  the latest version of each of your dependencies without considering whether
  this version is resolvable in the context of your POM. In future, we'll change
  that logic so that Dependabot updates you to the latest resolvable version.
- **Alternative repositories**. Dependabot will only query The Central
  Repository for dependencies. In future we'd like to support any repositories
  specified in your POM.

To get started, just click the "Add project" button and select the repo
you'd like to automate updates for. Select "Java - Maven" from the list of
languages, and click "Add".

If you use Maven we'd love to hear from you as we test support for it. If you
have any suggestions, or if you experience any issues, please don't hesitate to
[let us know][feedback-link]!

Finally, we'd like to say a huge thanks to [Even Holthe][evenh] for all his help
bringing Maven support for Dependabot. Even - it wouldn't have been possible
without you!

[feedback-link]: https://github.com/dependabot/feedback
[evenh]: https://github.com/evenh
