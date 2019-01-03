---
layout: post
title:  "Announcing Gradle support"
date:   2018-05-09 08:00:00 +0100
---

Using Gradle? Dependabot can now help you keep the dependencies in your
build.gradle files up-to-date.

<p class="image-medium">
  <img src="images/gradle-logo.svg" alt="Gradle" height="100px" />
</p>

Here's how it works:
- Dependabot looks for a "build.gradle" and (optionally) a "settings.gradle" in
  your repo, and pulls it down.
- Dependabot extracts the dependencies from the top-level project and any
  sub-projects, and checks against your repositories to see if they're
  up-to-date.
- If any updates are available, Dependabot creates individual PRs for each of
  your outdated dependencies.

We wanted to launch Gradle support as early as possible, so have released it
in alpha. As such it might be a little rough around the edges, but we'll use
your feedback to make it perfect.

If you use Gradle we'd love to hear from you as we test support for it. If you
have any suggestions, or if you experience any issues, please don't hesitate to
[let us know][feedback-link]!

🐘

[feedback-link]: https://github.com/dependabot/feedback
