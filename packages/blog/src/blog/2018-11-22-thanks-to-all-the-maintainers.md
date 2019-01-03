---
layout: post
title:  "Today, we're thankful for all the open-source maintainers"
date:   2018-11-22 11:00:00 +0100
---

Happy Thanksgiving. Today, we're thankful for all the open-source maintainers.
We couldn't have built Dependabot without their work. We're built on top of:
- 161 Ruby dependencies
- 1,420 JavaScript packages
- Ruby, Ubuntu and an unknown(!) number of libraries in our infrastructure
- Dozens of tools we use every day

Open source maintainers didn't just build the foundations for Dependabot - they
continue to support and improve them. We're thankful, and try to give back
when we can. We're [contributors to Bundler][bundler-post], pitch in with PRs
and issue reproduction cases on Yarn, npm, and Pipenv, and of course Dependabot
is free for open source repos and always will be.

Moshe Zadka has a great post on [how to give thanks to open source maintainers][zadka-article].
We'd like to add a 0th item (because we think it's the minimum we should all do)
to his list of ways to support that silent army:

**Update your dependencies.**

For a maintainer, supporting multiple versions of a project is painful. It's
painful to triage and try to replicate a bug only to find it has already been
fixed in an update. It's painful to backport security fixes. It's painful to
ship performance improvements and think that many users won't benefit from them.
A maintainer's time is most productive when their users are using the latest
version.

**Getting up-to-date isn't zero-effort, but it is worth it.**

You may have many out-of-date dependencies. You may need to refactor some of
your code to handle breaking changes. Digging into exactly how a dependency has
changed and why might be non-trivial. However, as well as helping maintainers,
being on the latest version is the best strategy for
[avoiding security vulnerabilities][security-analysis]. For most dependencies
the latest version is the most performant version. You'll also benefit from bug
fixes, new features and compatibility improvements.

Once you're up-to-date, we're here to help automate staying that way.

Happy Thanksgiving.

[zadka-article]: https://opensource.com/article/18/11/ways-give-thanks-open-source
[security-analysis]: ../the-latest-dependency-version-is-probably-the-most-secure
[bundler-post]: ../improving-dependency-resolution-in-bundler
