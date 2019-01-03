---
layout: post
title:  "Lerna support"
date:   2018-07-11 09:00:00 +0100
---

Working on a JavaScript monorepo that uses Lerna? Dependabot will now update all
your package.json files automatically.

<p class="image-medium">
  <img src="images/lerna.png" style="max-width: 480px;" alt="Automerge options" />
</p>

Previously, if you were using Dependabot on a monorepo that wasn't using Yarn
workspaces, each package had to be added to Dependabot individually. Then, when
there were updates, Dependabot would create an individual PR for each package in
the monorepo. That meant extra setup, and lots of near-identical PRs to review.

Now if you're using [Lerna][lerna] to manage a JavaScript monorepo you can just
add the root directory to Dependabot. Then, when one of your dependencies needs
updating, Dependabot will create a PR that updates it in all of your packages
at once.

We think the above behaviour is a big improvement, but if you prefer to old
behaviour of receiving separate PRs to each package in your monorepo you can,
of course, still add each package to Dependabot individually.

🐉

[lerna]: https://github.com/lerna/lerna
