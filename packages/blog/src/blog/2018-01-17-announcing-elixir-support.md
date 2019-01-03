---
layout: post
title:  "Announcing Elixir support"
date:   2018-01-17 10:00:00 +0100
---

Using Elixir? Dependabot can now help you keep your dependencies up-to-date. 🎉

<p class="image-medium">
  <img alt="Elixir logo" height="100px" src="images/elixir-logo.svg">
</p>

Here's how it works:
- Every day, Dependabot pulls down your "mix.exs" and "mix.lock".
- Dependabot extracts the top-level dependencies from your "mix.exs", and checks
  for any available updates.
- If any updates are available, Dependabot creates individual PRs to update each
  of your outdated dependencies.

We'd like to say a huge thanks to [Steve Domin][steve] for all his work on
adding Elixir support to Dependabot. He's building exciting things with Elixir
over at [Duffel][duffel].

If you use Elixir we'd love to hear from you as we test support for it. If you
have any suggestions, or if you experience any issues, please don't hesitate to
[let us know][feedback-link]!

[feedback-link]: https://github.com/dependabot/feedback
[steve]: https://twitter.com/stevedomin
[duffel]: https://www.duffelhq.com/
