---
layout: post
title:  "Dependabot now supports pip-compile"
date:   2018-05-19 09:00:00 +0000
---

If you use `pip-tools` to manage your Python dependencies, Dependabot will now
keep your `requirements.in` files up-to-date, too, and ensure your dependencies
are always compatible.

We've had Python support in Dependabot for almost a year now, and
[support for Pipenv][pipenv-support] since December. Adding support for
`pip-compile` is just the latest step in making it perfect, and should be great
for those who haven't jumped on the Pipenv bandwagon yet.

If there's ever anything you think we can do better with Dependabot please don't
hesitate to [get in touch][feedback-link]. We're always keen to hear your
feedback.

🤖

[feedback-link]: https://github.com/dependabot/feedback
[pipenv-support]: ../pipenv-beta
