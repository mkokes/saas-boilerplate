---
layout: post
title:  "Updating Ruby dependencies with a git source"
date:   2017-09-29 10:00:00 +0100
---

It's a really common problem: you contribute a fix or feature to a library but
want to pull in your changes before the maintainer has cut a release. The
solution is to use a git source specifying your commit, but it's easy to then
forget about the git source in your Gemfile and fall behind on other updates.

Well, good news! If you pin a Ruby dependency to a git revision, Dependabot will
now create an update PR for you if/when that revision is included in a release.

Want to track a branch rather than be updated to the latest release? That's fine
too - just specify a branch, rather than a commit, in your Gemfile. Dependabot
will then automatically create PRs to update your `Gemfile.lock` to use the
latest commit on that branch.

We're really excited about these features, but we can't take all the credit for
them: the idea for updating pinned dependencies was David Rodríguez's, who gave
us [this feedback][feedback-request]. Thanks David!

If there's a feature you'd like us to add, or if you ever have any feedback on
Dependabot, [let us know][feedback-link]!

🍸

**Update:** Dependabot can now update dependencies that use version-like git
tags, too! If you're using tags like `v0.11.0` in your Gemfile then you can
expect Dependabot to start updating them.

[feedback-request]: https://github.com/dependabot/feedback/issues/23
[feedback-link]: https://github.com/dependabot/feedback
