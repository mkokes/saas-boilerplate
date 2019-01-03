---
layout: post
title:  "Dependabot now supports Python"
date:   2017-07-24 10:30:11 +0100
---

Using Python? Dependabot now works with pip to automate keeping your
dependencies up-to-date.

To get started, just click the "Add project" button and select the Python repo
you'd like to automate updates for. We'll automatically detect its language.
Click "Add" and you're all done---Dependabot will check for updates for you
every day, and create PRs when it finds any.

We're excited about how Python support will develop, but for now it's worth
keeping a few things in mind:

- Dependabot will only look in your `requirements.txt` file for dependencies
- There's no resolver in `pip`, so Dependabot may try to upgrade one of your
  dependencies to a version that's incompatible with your other dependencies.
  The good people at PyPA are working on that [right now][pypa_resolver_issue]
  and we'll be the first to pull in their work come August.

We'd love to hear your feedback on how we can improve Python support -
[let us know][feedback_link]!

[pypa_resolver_issue]: https://github.com/pypa/pip/issues/988#issuecomment-308969728
[feedback_link]: https://github.com/dependabot/feedback
