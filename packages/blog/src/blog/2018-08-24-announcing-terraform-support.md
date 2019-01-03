---
layout: post
title:  "Announcing Terraform support"
date:   2018-08-24 12:00:00 +0100
---

Using Terraform to manage your infrastructure? Dependabot can now help keep
your Terraform modules up-to-date.

<p class="image-medium">
  <img src="images/terraform-logo.svg" alt="Terraform logo" height="100px" />
</p>

Here's how it works:
- **Dependabot looks for any `.tf` files** in your repo, pulls
  them down and parses them. It doesn't clone your repo, ever.
- **Dependabot checks each module for updates** by looking up its source
  and fetching the latest tags/versions.
- **Dependabot creates individual PRs** for each of your outdated modules.
  Each PR will contain links to the relevant changelog, release notes and
  commits, if available.

We'll be working on ironing out any bugs over the next few weeks, and we'd love
your [feedback][feedback-link] if you use Terraform.

🤖

[feedback-link]: https://github.com/dependabot/feedback/issues
