---
layout: post
title:  "Expanding our vision: automated refactors for major version updates"
date:   2017-06-30 10:30:11 +0100
---

A month ago we wrote about our [vision for dependency management][vision_blog_post].
At the time, we wanted to Dependabot to achieve the following:

1. **Automate the leg-work of updating** by checking for updates daily, finding
   changelogs and creating great PRs that keep themselves up-to-date
2. **Help check SemVer compliance and bugginess** by sharing the test suite
   results from each user's dependency updates
3. **Automate refactors for breaking changes** by encouraging standards for
   code transformation tools, and automatically applying them

We've always said that goal 3 was a bit of a pipe dream, but now we've got an
idea to surpass it for ambition:

- **Automate refactors for breaking changes** by machine learning the changes
   Dependabot users are making to their codebases to accommodate them

To be clear, we know this would be insanely hard, but that's the fun part.

A robot can dream, right?

[vision_blog_post]: ../a-bigger-vision-for-dependency-management
