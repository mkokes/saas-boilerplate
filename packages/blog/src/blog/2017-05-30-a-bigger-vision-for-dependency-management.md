---
layout: post
title:  "A bigger vision for dependency management"
date:   2017-05-30 09:31:11 +0100
---

Last week we launched Dependabot, a dependable robot who’ll keep your
dependencies up-to-date for you. We've got big plans for it.

### The small dream: automating the leg-work of updating
_TL;DR: There used to be tedious manual work involved in updating a dependency.
Dependabot already automates that away. We hope it means everyone will update
more often._

Before Dependabot, updating dependencies used to involve tedious manual work.
Staying up-to-date meant checking for new versions, finding the relevant
changelogs, and putting together pull requests. Most of it required time but no
thought. It was enough to stop many companies from updating regularly.

Automating the leg-work of updating a dependency is easy. Every day, Dependabot
creates PRs like [this one][moj-pr]. They save you time and encourage you to
stay up-to-date. That means [more secure][security-post] apps for everyone.

### The big dream: checking SemVer for easier reviews
_TL;DR: Reviewing a dependency update would be easier if you could rely on
everyone else’s test suites, as well as your own. With scale, Dependabot can
make that happen. We hope it will make the world less buggy._

Automating the manual work out of updating is easy. How about helping with the
tougher bit: reviewing the change?

For a [Semantically Versioned][semver] dependency the review should be easy:
bumping the patch or minor versions should just work. Trouble is, you need to
figure out if the dependency follows SemVer, and you probably want some
assurance it’s not buggy.

That’s where Dependabot can help. Sure, you’ve got your own test suite, but with
a bit of scale we can do even better: we can tell you if an upgrade is causing
spec failures on anyone else’s repos. And if it is, we can alert the dependency
maintainer, linking to an open-source repo as a test case.

Minor and patch releases to a post-1.0.0 dependency made up 85% of the last
1,000 pull requests Dependabot created. Making them trivial to review, and
ensuring they’re bug-free, should save everyone time and make the world a little
less buggy.

### The pipe dream: automatic refactors for breaking changes
_TL;DR: Most breaking changes have a single, simple strategy for updating. We
want to automate applying those changes. We hope it will speed up adoption of
new major versions, and improve the lives of dependency maintainers._

When there’s a breaking change in a dependency you rely on, it’s normally time
to dust off your keyboard and write some code. But almost everyone using the
dependency is writing the same code. Couldn’t that be automated?

Some of the tools to automate code changes already exist: Facebook’s
[jscodeshift][facebook-codeshift] iis already public, and there has been public
discussion of Google’s [Rosie][google-rosie]. When Ruby’s RSpec significantly
updated its syntax in version 3, Yuji Nakayama wrote [Transpec][transpec] to aid
with the upgrade process.

Automatically refactoring  when a dependency has breaking changes will require
more tools, and will need each language community to agree on standards for
writing code transformations. We hope Dependabot can help encourage the adoption
of those tools and standards by automating their application. Doing so will not
only save developers time — it will make dependency authors less constrained,
and able to deliver everyone better code.

### This sounds awesome. How can I help?
Excited about what we could achieve with Dependabot? The biggest thing you could
do to help is to use it! The service is free for open source projects and always
will be.

[moj-pr]: https://github.com/ministryofjustice/prison-visits-2/pull/871
[security-post]: ../the-latest-dependency-version-is-probably-the-most-secure
[semver]: http://semver.org/
[google-rosie]: https://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/pdf
[facebook-codeshift]: https://github.com/facebook/jscodeshift
[transpec]: http://yujinakayama.me/transpec/
