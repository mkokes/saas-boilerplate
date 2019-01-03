---
layout: post
title:  "Automatic security updates for JavaScript"
date:   2018-04-11 07:00:00 +0100
---

Dependabot now creates pull requests immediately in response to security
advisories for Node packages. 🕵️‍♀️

Here's how it works:
- Dependabot polls [The Node Security Working Group's database][node-security-wg],
  looking for new advisories
- If it finds any, Dependabot kicks off update runs to update that specific
  dependency immediately for any users who have it
- Dependabot prefixes the titles of the created PRs with `[Security]` and
  includes details of the vulnerabilities fixed in the PR message

If you want to automatically merge security updates, there's an option for that:

<p class="image-medium">
  <img src="images/security-automerge.png" style="max-width: 700px;" alt="Automerge options" />
</p>

And if you only want to receive pull requests from Dependabot that are security
related, there's an option for that, too:

<p class="image-medium">
  <img src="images/security-updates-only.png" style="max-width: 700px;" alt="Security updates only option" />
</p>

We're hugely grateful to the Node Security Working Group team for creating the
database, and have already proposed some small contributions to it. We're
looking forward to doing more, and to supporting their work however we can.

Stay safe out there!

🍸

PS: Using another language? We announced the same functionality for
Ruby, PHP, Elixir and Rust [last week][security-announcement].

[security-announcement]: ../automatically-respond-to-security-advisories
[node-security-wg]: https://github.com/nodejs/security-wg
