---
layout: post
title:  "Dependabot now supports Elixir umbrella applications"
date:   2018-03-02 10:00:00 +0000
---

When we added beta support for Elixir six weeks ago one of the things that was
missing was support for umbrella applications. As of today, that's fixed.

To use Dependabot on an Elixir umbrella application, just add the repo as
normal. Dependabot will handle everything automatically and start creating pull
requests for you.

Huge thanks to [Steve Domin][steve] for working with us on this one. Next up:
support for git dependencies. After that we'll be blessing our Elixir support
with full release status.

🍸

[steve]: https://twitter.com/stevedomin
