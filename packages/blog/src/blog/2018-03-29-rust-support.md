---
layout: post
title:  "Announcing Rust support"
date:   2018-03-29 08:00:00 +0100
---

Using Rust? Dependabot can now help you keep your Cargo.toml and Cargo.lock
files up-to-date.

<p class="image-medium">
  <img src="images/rust-logo.svg" alt="Rust" height="100px" />
</p>

Here's how it works:
- Dependabot looks for a "Cargo.toml" and (optionally) a "Cargo.lock" in your
  repo, and pulls it down.
- Dependabot extracts the dependencies and checks with crates.io for new
  versions.
- If any updates are available, Dependabot creates individual PRs for each of
  your outdated dependencies.

We wanted to launch Rust support as early as possible, so have released it
in beta. ~~As such, we currently **don't** support Rust workspaces - we'll
add support for them in the next couple of days, though.~~ Update: Dependabot
now supports Rust workspaces.

If you use Rust we'd love to hear from you as we test support for it. If you
have any suggestions, or if you experience any issues, please don't hesitate to
[let us know][feedback-link]!

📦

[feedback-link]: https://github.com/dependabot/feedback
