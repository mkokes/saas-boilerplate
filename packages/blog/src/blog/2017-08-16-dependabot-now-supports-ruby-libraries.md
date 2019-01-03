---
layout: post
title:  "Dependabot now supports Ruby libraries"
date:   2017-08-16 10:30:11 +0100
---

Dependabot can now help you keep the sub-dependencies of your Ruby gems
up-to-date.

Ever day, Dependabot will check whether any of your gem's sub-dependencies have
been updated. If they have, and the new version isn't covered by the range in
your `gemspec`, it will open a pull request to extend that range. Here's
[an example][example].

We hope the above will help maintainers out a bit. Whilst the PRs won't be as
easy to merge as they are for apps (since they'll mainly be for major version
bumps), they should at least provide timely reminders to review your `gemspec`.
If that makes employing a [pessimistic versioning strategy][pessimistic-blog-post]
easier it could help make dependency management a bit better for everyone.

[Dependabot][dependabot] is totally free for open source, and always will be,
so this one is on us. 🎁

**Update:** A couple of people have asked exactly how Dependabot updates the
requirements in the gemspec. The TL;DR is:
- for **runtime dependencies** it extends the range to include the new version,
  whilst continuing to allow all previously supported versions
- for **development dependencies** it does the same, except when an `=` or `~>`
  matcher is used, in which case it drops support for the previous version

If you want all the gory detail then the code is, of course,
[open source][update-code].

[example]: https://github.com/greysteil/spot-gps/pull/7
[pessimistic-blog-post]: https://blog.codeship.com/optimists-guide-pessimistic-library-versioning/
[dependabot]: https://dependabot.com
[update-code]: https://github.com/dependabot/dependabot-core/blob/08c9e937f382361c32725cfefa2c9b3d69861b32/lib/dependabot/update_checkers/ruby/bundler.rb#L325-L345
