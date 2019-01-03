---
layout: post
title:  "GitHub Security Alerts integration"
date:   2018-07-17 04:00:00 +0100
---

We've integrated Dependabot with GitHub's Security Alerts. Now when you receive
a security alert from GitHub you can expect a PR from Dependabot that fixes it
soon after.

<p class="image-medium">
  <a href="https://github.com/ministryofjustice/bba/pull/42">
    <img src="images/security-pr.png" style="max-width: 700px;" alt="Security PR" />
  </a>
</p>

Dependabot has [automatically responded to security advisories][automatically-respond-to-security-advisories]
since April, when we integrated with sources for Ruby, Rust and PHP
vulnerability alerts. Since then we've also added a JS source, and created an
Elixir one.

Integrating with GitHub's Security Alerts gives us another great data source
that is [expanding fast][github-python-advisories] and has a
[fantastic team behind it][appcanary-acquired]. We owe a huge debt of thanks to
GitHub for making the data available - it's another significant contribution
to the open source community from a company that already does so much.

Stay safe out there!

🕵️‍♀️

[automatically-respond-to-security-advisories]: ../automatically-respond-to-security-advisories
[elixir-advisory-database]: https://github.com/dependabot/elixir-security-advisories
[appcanary-acquired]: https://blog.appcanary.com/2018/goodbye.html
[github-python-advisories]: https://blog.github.com/2018-07-12-security-vulnerability-alerts-for-python/
