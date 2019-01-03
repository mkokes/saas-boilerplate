---
layout: post
title:  "Announcing Poetry support"
date:   2018-08-15 12:00:00 +0100
---

Using Poetry as your package manager for Python? Dependabot can now help keep
your `pyproject.toml` and `pyproject.lock` up-to-date. 🎉

If you haven't heard of it, [Poetry][poetry] is a new package manager by
Sébastien Eustace. Like [Pipenv][pipenv] it replaces your `requirements.txt`
files with a manifest and lockfile setup, and does version resolution to ensure
you don't have any version conflicts.

In addition to Pipenv's improvements Poetry includes a full resolver, based on
Ruby's Molinillo. It's lightning fast and a big improvement over Pipenv's current
resolver (although news on that is coming in the next few weeks).

Pipenv is still the [recommended package manager][pipenv-official-tweet] and has
a great team behind it, but if you prefer Poetry then Dependabot has your back.
We now offer support for updating your `pyproject.toml` and `pyproject.lock`.

We'll be improving Poetry support rapidly based on your [feedback][feedback],
but we're confident it already works well. The only caveat is that your first
Dependabot PR for a poetry project will update all of your subdependencies
(top-level dependencies will still be updated one-by-one). We have a
[PR open][poetry-pr] on the Poetry repo to fix that.

🐍

[poetry]: https://github.com/sdispater/poetry
[pipenv]: https://github.com/pypa/pipenv
[pipenv-official-tweet]: https://twitter.com/kennethreitz/status/936239842039619584
[feedback]: https://github.com/dependabot/feedback/issues
[poetry-pr]: https://github.com/sdispater/poetry/pull/389
