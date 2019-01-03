---
layout: post
title:  "Announcing Elm support"
date:   2018-08-04 07:00:00 +0100
---

Using Elm? Dependabot can now help you keep your `elm-package.json` file
up-to-date.

<p class="image-medium">
  <img src="images/elm-logo.svg" alt="Elm logo" height="100px" />
</p>

Here's how it works:
- **Dependabot looks for an `elm-package.json`** in your repo, pulls
  it down and parses it. It doesn't clone your repo, ever.
- **Dependabot checks each dependency for updates** by looking at its source
  repo and then checking whether any available updates are resolvable.
- **Dependabot creates individual PRs** for each of your outdated dependencies.
  Each PR will contain links to the relevant changelog, release notes and
  commits.

We'll be working on ironing out any bugs over the next few weeks, but
Dependabot's Elm support should be feature complete right now. The only caveat
is that currently Dependabot only works with Elm 0.18.

Give it a try and [let us know][feedback-link] if you have any feedback!

We'd like to say a huge thank you to [Juliano Solanho][juliano-twitter] for
contributing all of the work on Elm support over at [Dependabot Core][elm-pr].
Thanks so much Juliano!

🤖

[feedback-link]: https://github.com/dependabot/feedback
[juliano-twitter]: https://twitter.com/julianobs
[elm-pr]: https://github.com/dependabot/dependabot-core/pull/614
