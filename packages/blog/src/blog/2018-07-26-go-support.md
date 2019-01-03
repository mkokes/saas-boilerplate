---
layout: post
title:  "Announcing Go support"
date:   2018-07-26 04:00:00 +0100
---

Using Go? If you're using `dep` for your dependency management then Dependabot
can now help you keep your `Gopkg.toml` and `Gopkg.lock` files up-to-date.

<p class="image-medium">
  <img src="images/dependabot-logo-square.svg" alt="Dependabot" height="100px" style="max-width: 100px;" />
  <img src="images/go-gopher.svg" alt="Go" height="100px" style="max-width: 100px;" />
</p>

Here's how it works:
- **Dependabot looks for a `Gopkg.toml` and a `Gopkg.lock`** in your repo, pulls
  them down and parses them. It doesn't clone your repo, ever.
- **Dependabot checks each dependency for updates** by looking at its source
  repo and checking whether any available updates are resolvable.
- **Dependabot creates individual PRs** for each of your outdated dependencies.
  Each PR will contain links to the relevant changelog, release notes and
  commits.

We wanted to launch Go support as early as possible, so have released it
in alpha. As such, there are a couple of caveats you should be aware of:
- **Dependabot creates dep v0.5.0 format lockfiles**. If you're using a previous
  version of dep we recommend you upgrade to [v0.5.0][dep-v0.5.0] - it includes
  some big performance improvements.
- ~~**Dependabot will always widen `Gopkg.toml` ranges** if they need to be
  updated. That's the right behaviour for libraries, but not for applications,
  and Dependabot can't tell them apart. We'll make it configurable soon.~~
  Dependabot now checks all your top-level files looking for a `package main`
  declaration. If it finds one it will keep your `Gopkg.toml` constraints
  in line with your `Gopkg.lock` versions.
- **Dependabot doesn't yet support vendoring for Go dependencies** so if you
  commit a vendor folder Dependabot won't update it for you.

We'll be working on the above and ironing out bugs over the next few weeks.
We'll also be looking at adding support for vgo/modules - we prefer dep's
approach, but if the community settles on vgo there will be an even bigger need
for a tool to help keep dependencies up-to-date.

We'd love your help to get Dependabot's Go support perfect. If you have any
suggestions, or if you experience any issues, please don't hesitate to
[let us know][feedback-link]!

🤖

[feedback-link]: https://github.com/dependabot/feedback
[dep-v0.5.0]: https://golang.github.io/dep/blog/2018/07/25/announce-v0.5.0.html
