---
layout: post
title:  "Helping test Bundler 1.16.0"
date:   2017-09-07 7:30:11 +0100
---

Dependabot is currently helping test the latest pre-release candidate of
Bundler 1.16.0. If you see anything odd in any of the pull requests we generate,
let us know.

We've had the privilege of working with the Bundler team on
[improving the algorithm for dependency resolution][improving-resolution] in
Bundler 1.16.0. Now we're helping test it by using a pre-release to generate
Dependabot's pull requests.

### How you can help

We're pretty confident the resolver is already bug-free, and have tested it
extensively ourselves, but if you see anything odd, we want to know. Just
comment on the Dependabot PR as you normally would.

If you want to get more involved, an easy place to start would be upgrading the
version of Bundler you run locally and reporting any issues you find to the
Bundler team. You can update by running:

```
gem update bundler --pre
```

### Future plans

In the future, we're planning to roll out a way for Dependabot users to opt-in
to running pre-releases of other dependencies against their test suites to
generate feedback for maintainers. Done right, we hope we can catch more bugs
early, and save everyone some time. That's a story for another day, though.

✌️

[improving-resolution]: ../improving-dependency-resolution-in-bundler
