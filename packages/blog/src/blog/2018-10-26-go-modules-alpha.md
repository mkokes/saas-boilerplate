---
layout: post
title:  "Announcing Go modules support"
date:   2018-10-25 16:00:00 +0100
---

Good news for Gophers: Dependabot can now keep your `go.mod` and `go.sum` files
up to date 🎉

<p class="image-medium">
  <img src="images/dependabot-logo-square.svg" alt="Dependabot" height="100px" style="max-width: 100px;" />
  <img src="images/go-gopher.svg" alt="Go" height="100px" style="max-width: 100px;" />
</p>

Here's how it works:
- **Dependabot looks for a `go.mod` and (optionally) a `go.sum`** in your
  repo, pulls them down and parses them.
- **Dependabot checks each dependency for updates** by looking at its source
  repo and checking whether any available updates are resolvable.
- **Dependabot creates individual PRs** for each of your outdated dependencies.
  Each PR will contain links to the relevant changelog, release notes and
  commits.

Hot on the heels of [launching support for Dep][dep-post], we wanted to add
support for Go modules (formerly known as vgo) as quickly as possible, so have
released it in alpha.

As such, there are a couple of caveats you should be aware of:
- **We'll only upgrade minor and patch versions for the time being**. Go modules
  comply with [Semantic Import Versioning][sem-im-ver], which basically means
  the major version must be in the import path (e.g. `rsc.io/quote/v3`). Under
  this scheme, to upgrade to a new major version, we would need to rewrite
  imports across your project to point to the new path. As we currently only
  pull down the `go.mod` and `go.sum` rather than cloning the whole repository,
  this isn't practical for us to do right now.
- **We don't update pseudo-versions, yet**. In this initial release, we'll only
  upgrade semver-compatible versions. Support for upgrading pseudo-versions
  that point to a specific commit will follow shortly.

We'd love your help to get Dependabot's Go support perfect. If you have any
suggestions, or if you experience any issues, please don't hesitate to
[let us know][feedback-link]!

🤖

[dep-post]: https://dependabot.com/blog/go-support/
[sem-im-ver]: https://research.swtch.com/vgo-import
[feedback-link]: https://github.com/dependabot/feedback
