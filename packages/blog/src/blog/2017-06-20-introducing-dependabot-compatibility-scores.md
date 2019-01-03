---
layout: post
title:  "Introducing Dependabot compatibility scores"
date:   2017-06-20 10:30:11 +0100
---

From today, Dependabot pull requests will include details the percentage of test
suites that pass for the relevant update, in the form a compatibility badge:

<p class="image-medium">
  <img src="https://api.dependabot.com/badges/ci_status?dependency-name=pg&amp;package-manager=bundler&amp;previous-version=0.20.0&amp;new-version=0.21.0" alt="Compatibility score badge">
</p>

We've written up details of how the badge is calculated [here][compatibility_score_webpage].

Compatability scores are a beta feature, but we couldn't wait to get them into
your hands. We're looking forward to them becoming more robust as more people
use Dependabot.

As always, we'd love your [feedback][feedback].

[vision_blog_post]: ../a-bigger-vision-for-dependency-management
[compatibility_score_webpage]: https://dependabot.com/compatibility-score.html
[feedback]: https://github.com/dependabot/feedback/issues
