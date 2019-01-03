---
layout: post
title:  "Dependabot's PHP support is out of beta"
date:   2018-01-16 10:00:00 +0000
---

We released beta [support for PHP][release-post] back in June last year. Today,
we're blessing it with full release status. 🎉

Dependabot is now running on over 100 PHP repos, and it's our fastest growing
language. Our PHP support isn't perfect[^1] but if you have a good test suite
then it's ready for you to rely on.

We'll keep improving Dependabot based on [your feedback][feedback-link], so keep
it coming!

Enjoy!

🍸

[^1]: The issue we're aware of is that Dependabot ignores PHP platform requirements. If you're using PHP 7.0+ this should be fine, but Dependabot may generate PRs that are incompatible with PHP 5.6. There's an open issue with more details [here][platform-reqs-issue].

[release-post]: ../dependabot-now-supports-php
[feedback-link]: https://github.com/dependabot/feedback
[platform-reqs-issue]: https://github.com/dependabot/feedback/issues/70
