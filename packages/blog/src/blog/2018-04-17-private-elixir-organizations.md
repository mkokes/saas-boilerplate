---
layout: post
title:  "Private Elixir packages and organizations"
date:   2018-04-17 08:00:00 +0100
---

Dependabot now supports private Elixir packages and organizations.

Last month, the Hex.pm team announced they were going
[live with organizations][hex-blog-post]. Now Dependabot can keep your private
Elixir packages and organisations up-to-date, too.

Here's how it works:
- Dependabot will automatically detect if your repo uses any private packages
  during its first update run.
- If it does, Dependabot will create an issue asking you to add an auth key
  as a config variable.
- Once you've added your auth details, updates will run as usual.

If you use Hex.pm organizations and have any trouble [let us know][feedback] and
we'll get any issues fixed immediately.

🍸

[hex-blog-post]: https://hex.pm/blog/organizations-going-live
[feedback]: https://github.com/dependabot/feedback
