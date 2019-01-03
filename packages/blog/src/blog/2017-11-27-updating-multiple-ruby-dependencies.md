---
layout: post
title:  "Handling thorny Ruby dependency updates"
date:   2017-11-27 13:00:00 +0000
---

Since launching Dependabot for Ruby six months ago, we've had a guilty secret:
Dependabot couldn't handle the most difficult updates. Specifically, it couldn't
hack updates where multiple dependencies needed to be updated at the same time.

Now it can.

Want an example? Check out [this pull request][brew_pull_request]. Here, the
Gemfile specified both `bootstrap` and `popper_js` and `bootstrap` also relied
on `popper_js` as a sub-dependency. All the specifications had tight version
requirements, so the only way to update was to bump both gems at the same time.

Don't think it's that common? Well, we see lots of Gemfiles specifying both
[`rspec` and `rspec-rails`][rspec_pull_request], for example.

There used to be a name for difficult updates like these - it was
"dependency hell". With it's new multi-dependency updating powers, Dependabot
should be able to make that a thing of the past.

✌️

[brew_pull_request]: https://github.com/zedtux/brewformulas.org/pull/156
[rspec_pull_request]: https://github.com/ontohub/ontohub-backend/pull/315
