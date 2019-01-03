---
layout: post
title:  "Dependabot's JavaScript support just got even better"
date:   2017-12-06 09:00:00 +0000
---

We've just made Dependabot much easier to use with JavaScript:

- **No lockfile required:** You can now use Dependabot on JavaScript projects
  that don't have a lockfile. We'll bump the requirements in your `package.json`
  to ensure they always cover the latest version
- **Automatic lockfile detection:** Dependabot will now figure out if you're
  using Yarn or npm (or both, or neither) automatically. No need to tell us when
  you get setup, or if you switch
- **Yarn Workspaces support:** If you're working on a JavaScript monorepo then
  you might have heard of [Yarn Workspaces][yarn-workspaces]. Dependabot now
  supports them, so you can keep your entire monorepo up-to-date easily

Our 5,000th JavaScript PR was merged yesterday, so we must be doing something
right, but we won't stop until we think our JS support is perfect.

Anything else we could do better? [Let us know!][feedback-link]

🍸

[yarn-workspaces]: https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/
[feedback-link]: https://github.com/dependabot/feedback
