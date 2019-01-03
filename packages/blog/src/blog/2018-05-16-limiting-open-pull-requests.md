---
layout: post
title:  "Limiting the number of open Dependabot PRs"
date:   2018-05-17 09:00:00 +0000
---

By default, Dependabot will now limit the number of open pull requests it has
for any project/language combination to 10.

Previously, if you left a repo for a while, Dependabot would keep generating
more and more PRs as it became out of date. Then, when you came back to it and
merged one of those PRs, Dependabot would automatically rebase all the others,
creating a heavy CI workload.

Now, if you take a break from merging Dependabot PRs, Dependabot will limit the
number it has open to 10.  We of course make an exception for PRs that fix a
security vulnerability - we'll always create them immediately.

We think the above is a better flow, so we're excited to have rolled it out for
everyone. If you prefer the old behaviour, however, we've added the option to
disable PR limits in your account settings.

✌️

