---
layout: post
title:  "Support for multimodule Maven projects"
date:   2018-04-21 18:00:00 +0000
---

Dependabot can now help you keep multimodule Maven projects up-to-date.

We released alpha support for Maven back in January, and have been steadily
improving Dependabot's handling of `pom.xml` files since.
Last week we made some big improvements which we think are worth calling out.
1. Dependabot now implements Maven's versions comparison specification in full.
   That means it knows that `1.0.0` is less than `1.0.0u2`, but greater than
   `1.0.0m`, and you can rely on it to update you to the latest version.
2. Dependabot now supports multimodule Maven projects. If you add the base POM
   of a multimodule project, Dependabot will automatically get to work on the
   full tree of dependency files, keeping your project consistent and
   up-to-date.

We still have some work to do to get Maven support to full release status, but
it should already be useful. We'd love your [feedback][feedback-link] on it, and
will be prioritising Maven improvements over the coming weeks.

Finally, we're extremely grateful to [Even Holthe][evenh] for his
[feedback][even-issue] and help making multimodule support in Dependabot
possible. Thanks Even!

Enjoy!

🍸

[feedback-link]: https://github.com/dependabot/feedback
[evenh]: https://github.com/evenh
[even-issue]: https://github.com/dependabot/dependabot-core/issues/222
