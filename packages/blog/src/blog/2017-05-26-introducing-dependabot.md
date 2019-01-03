---
layout: post
title:  "Introducing Dependabot!"
date:   2017-05-26 09:31:11 +0100
---

Today, we’re launching Dependabot — a dependable robot who’ll keep your dependencies up-to-date for you. Here’s how it works.

### Dependa-what?
Dependabot is a [GitHub app][dependabot-github-app] that automates dependency updates.

Every day, Dependabot pulls down your dependency files and looks for any outdated requirements. If any of your dependencies are out-of-date, Dependabot opens individual pull requests to bump each one. All you need to do is check your tests pass, scan the included changelog and release notes, and make a call on hitting merge or skipping the new version.

Currently Dependabot supports Ruby and Javascript (Yarn), with support for PHP and npm5 coming very soon.

### Dependa-why?
We’ve blogged in detail about [why you should keep your dependencies up-to-date][dependabot-why-bother], including analysing [10 years of Rubysec vulnerability data][dependabot-security-analysis]. The TL;DR is:

- Staying up-to-date is the most secure strategy
- Making incremental changes beats have big-bang updates

There are other apps out there that can help you with the above, but Dependabot is the only one that supports multiple languages and has an [open-source core][bump-core].

### Dependa-ok-this-looks-awesome-how-do-I-sign-up?
Just click on one of the links below. The app is totally free for the first month if you sign up before June 14th 2017.


[dependabot-github-app]: https://github.com/apps/dependabot
[dependabot-security-analysis]: ../the-latest-dependency-version-is-probably-the-most-secure
[dependabot-why-bother]: ../why-bother
[bump-core]: https://github.com/gocardless/bump-core
[dependabot]: https://dependabot.com
