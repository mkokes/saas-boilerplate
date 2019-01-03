---
layout: post
title:  "Little touches"
date:   2017-12-17 09:00:00 +0000
---

We love making Dependabot as delightful as possible - we think it makes the
difference between a product people use and one they love.

For example, in the last couple of weeks we shipped two little touches we're
really proud of:
- **Semantic commit messages.** We heard from the team at [wire][wire] that they
  use [semantic commit messages][semantic-commit-messages] and wanted Dependabot
  to do the same. Then we heard from someone else that they didn't like the
  semantic prefixes much. Our solution? We now include the semantic prefix only
  if the repo was already using it [(here's the code)][semantic-code].
- **Custom pull request labels.** By default we label the PRs Dependabot creates
  with a `dependencies` label, but we heard from
  [one customer][custom-labels-tweet] that they wanted to use their own label.
  Could we add a setting? No way! Dependabot can do better than that! We now
  ask if you'd like to use a new label for future PRs if/when you change the
  label on a Dependabot PR [(here's a screenshot)][custom-labels-solution].

We're always looking for other ways we can make Dependabot even better. Got a
suggestion? [Let us know!][feedback-link]

🍸

[wire]: https://wire.com
[semantic-commit-messages]: https://seesparkbox.com/foundry/semantic_commit_messages
[semantic-code]: https://github.com/dependabot/dependabot-core/commit/77bd3b823d740c65d3a89f1e7027a3ca4fbf09e9
[custom-labels-tweet]: https://twitter.com/andrewfomera/status/940338532828286977
[custom-labels-solution]: https://twitter.com/dependabot/status/940632100834865154
[feedback-link]: https://github.com/dependabot/feedback
