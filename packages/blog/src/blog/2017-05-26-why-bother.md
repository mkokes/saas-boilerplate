---
layout: post
title:  "Why bother keeping dependencies up-to-date?"
date:   2017-05-26 14:31:11 +0100
---

Dependabot has pretty strong views on dependency management. If you use it, you’re signing up to keep your dependencies up-to-date all the time (although it’s easy to ignore versions you don’t want to use).

That’s great, but is keeping your dependencies up-to-date something you actually want to do? We think it should be, for two reasons:

1. The latest version is usually the greatest version
2. Iterative improvements are better than big-bang changes

### The latest version is the greatest version
_TL;DR: You probably already believe this. How often do you add a new dependency and chose anything other than the latest version?_

Generally speaking, each new release has:

- New features. You [knew][rails-5-release] [that][django-1-11-release]. Let’s not spend any more time on it.
- Better security. Yes, updates often include [reactive][rails-security-patch] [security][2017-owasp] [fixes][2013-owasp], but did you know they’re also [less likely to be affected by new vulnerabilities][dependabot-security-analysis]?
- Improved performance. Library authors are trying to ship you the best code they can. Generally speaking, it’s [getting better over time][adequate-record].
- Bug fixes. Just take a look at [these][puma_changelog] [changelogs][plug_changelog] and tell me you’d be better off on an older version.

Don’t get me wrong, there are exceptions to the above. Rails 3 was slower than Rails 2. Major new releases can have new bugs, as well as fixes. Security vulnerabilities are occasionally only present in the latest version.

Overall, though, when you’re thinking about dependency management you’re looking for a default position, not a hard rule. From a security, performance, robustness and feature perspective, it’s rare that the latest version isn’t the best one. That’s why it’s almost always the version you pick when you add a new dependency.

### Iterative improvements beat big-bang changes
_TL;DR: You almost certainly already believe this. If you’re not applying it to your dependency management, the only reason is probably a tooling one._

If you’re reading this blog post then the year is at least 2017 and you’re almost certainly taking an incremental approach to improving your product. [Everyone][thoughtworks-continuous-delivery] [tells][atlassian-continuous-delivery] [you][mckinsey-continuous-delivery] [to][puppet-continuous-delivery]. You may or may or may not be doing so when managing your dependencies. If not, why not?

The argument against making small, incremental updates is when there’s a lot of work to be done for each change, _regardless of the size of the change_ (see maths addendum, if you’re into that). That’s the reason incremental product improvements weren’t sensible before automated testing and deployment, and it might be the reason many people still don’t keep their dependencies up-to-date. When there’s a high fixed cost for each change, the optimal strategy is to make fewer, larger changes.

But this is 2017 — we have the tools to do better. The fixed cost in dependency management comes from checking for updates, finding changelogs, and putting together a pull request; Dependabot does all three for you. And once those fixed costs go to zero, it makes sense for you to do more, smaller updates — i.e., a continuous improvement process.

### Who are you, who are so wise in the ways of dependency management?
Hi! Grey and Harry here, the team behind Dependabot. Previously, we ran Product and Engineering at GoCardless, a payments company.

We’ve been managing dependencies for years, and slowly refined and automated our approach. At GoCardless, security and robustness were always our primary concern, and over time we found being on the latest version of our dependencies was best for both. When we did occasionally find bugs in new releases it was almost always our test suite that caught them, and we were able to contribute back to the maintainer.

The result of those years of improvement is Dependabot — a dependable bot who’ll do all the leg-work of keeping your dependencies up-to-date for you, but still leaves you in total control.

------

#### Maths addendum
It’s relatively straightforward to solve for the optimal updating strategy, given an effort function _f(x)_ where _x_ is the number of versions being upgraded in one go. Total effort to upgrade by _N_ versions, potentially over the course of many years, is then _(N/x)f(x)_, and that’s what we want to minimise.

Assuming _f(x) = K + g(x)_, where _K_ is the fixed cost of making any change (i.e., context switching, finding a changelog, creating a pull request) and _g(x)_ is super-linear (i.e., reviewing the change from 1.0 to 1.3 in one go is harder than reviewing the changes between each version incrementally) the optimal size of each update will be monotonically increasing in _K_.

[rails-5-release]: https://rubysec.com/
[django-1-11-release]: https://docs.djangoproject.com/en/1.11/releases/1.11/#what-s-new-in-django-1-11
[rails-security-patch]: http://weblog.rubyonrails.org/2015/6/16/Rails-3-2-22-4-1-11-and-4-2-2-have-been-released-and-more/
[2017-owasp]: https://www.owasp.org/index.php/Top_10_2017-A9-Using_Components_with_Known_Vulnerabilities
[2013-owasp]: https://www.owasp.org/index.php/Top_10_2013-A9-Using_Components_with_Known_Vulnerabilities
[dependabot-security-analysis]: ../the-latest-dependency-version-is-probably-the-most-secure
[adequate-record]: https://tenderlovemaking.com/2014/02/19/adequaterecord-pro-like-activerecord.html
[puma_changelog]: https://github.com/puma/puma/blob/master/History.md
[plug_changelog]: https://github.com/elixir-lang/plug/blob/master/CHANGELOG.md
[thoughtworks-continuous-delivery]: https://www.thoughtworks.com/insights/blog/case-continuous-delivery
[atlassian-continuous-delivery]: https://www.atlassian.com/continuous-delivery/business-case-for-continuous-delivery
[mckinsey-continuous-delivery]: http://www.mckinsey.com/business-functions/digital-mckinsey/our-insights/beyond-agile-reorganizing-it-for-faster-software-delivery
[puppet-continuous-delivery]: https://puppet.com/blog/business-case-continuous-delivery
