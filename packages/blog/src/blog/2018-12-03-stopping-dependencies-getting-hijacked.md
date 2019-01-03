---
layout: post
title:  "How do we stop attackers hijacking dependencies?"
date:   2018-12-03 09:00:00 +0100
---

Last week a malicious alteration was discovered in `event-stream`, a widely
downloaded npm package. Full details are in the
[npm team's write up][npm-event-stream-writeup], but the tl;dr is that a bad
actor was added as a maintainer of `event-stream` and inserted
malware into a new release. The malware was discovered three months later.

It's not the first time an attacker has gained access to a popular npm
package - in July a [similar attack targeted ESLint][eslint-scope-attack] users.

How do we solve this one? We think there are four broad themes:
1. Make it harder for attackers to hijack packages
2. Make it easier for maintainers to detect hijacks
3. Make it easier for users to detect hijacked packages
3. Make the response to known insecure packages faster

Dependabot can help with some of the above. Other issues need to be tackled by
npm and other language registries (many of which are open source and need your
help). Still others need cultural changes.


## Making hijacks harder

The `eslint-scope` and `event-stream` attacks show two different ways attackers
can get malicious code into a release:
- In the `eslint-scope` case a maintainer's credentials were compromised after
  they had reused their password on other sites
- In the `event-stream` case a maintainer was tricked into granting npm
  privileges to the attacker, who posed as a new maintainer

Additionally, an attacker doesn't need to get release access on npm if they can
convince a maintainer to merge a PR that pulls in the malicious code. There's a
(fictional) account of that in this [blog post][fictional-pr-approved-attack].

The compromised credentials case is the easiest to prevent. Two factor
authentication makes a big difference here. Ideally, we believe it should be
compulsory when publishing releases of packages with over a certain threshold of
downloads each week.

Preventing social engineering attacks is harder. Since the `event-stream` attack
there's been good (and bad!) discussion about how to make open source
maintenance more sustainable. Initiatives like [Jazzband][jazzband] surely have
a role to play, alongside the various organisations trying to make open source
financially sustainable. We don't have a clear recommendation here.

**Our recommendations:**
- All registries should implement some form of two-factor authentication, and
  require it for popular packages


## Helping maintainers detect hijacks

The first line of defence against a package hijack is the package maintainers.
If they're engaged, and for most popular projects they are, they're best placed
to both spot and shut down the hijack.

In response to the `eslint-scope` attack the npm team implemented email alerts
to all maintainers whenever a new version of a package is published. That's
hugely valuable - it means that if a maintainer's credentials are compromised
they will discover it as soon as a new release is cut. It's also an incredibly
simple fix to implement, and we'd encourage all registries to do so. You can
help - many are open source.

Email alerts didn't help with `event-stream` attack, however, because the only
maintainer was now the attacker. In that case only users can detect the hijack.

**Our recommendations:**
- All registries should notify maintainers each time a release is cut. If a
  maintainer's credentials are compromised this ensures they hear about it


## Helping users detect hijacks

The most worrying thing about the `event-stream` attack is that it took 3 months
to detect, despite 2 million weekly downloads.

Detection was slow because most users have no direct interaction with
`event-stream`. Like many JS dependencies it is almost always pulled in as a
transitive dependency.<sup>[1](#footnote1)</sup> In this case the attack took further
advantage of transitive dependencies being inscrutable - the
[commit responsible for the attack][event-stream-commit] introduces a new,
malicious dependency to `event-stream` itself.

Dependabot can help a little here, by making it easier for users that do
directly import a dependency to review changes to it. We already include
changelogs, release notes and commit diffs in our PRs, but starting today we're
experimenting with also highlighting when a version has been released by a new
maintainer. We suggest users apply additional scrutiny when upgrading to such
releases, and hope it will help spot future hijacks.

There's more to be done here, however. The commit diffs that Dependabot links to
on the source repo, for example, are not guaranteed to match the diff on npm,
because npm doesn't publish the git commit SHA that was used to build the
package (or, indeed, require one at all). Transitive dependencies remain a soft
target as fewer users apply scrutiny to them when updating.

We'd like to do even more here, and are continuing to think on ways we can help.

**Our recommendations:**
- Dependabot is experimenting with including details of the new maintainer in
  our pull requests if they have changed
- To help users review dependency updates for malicious changes, npm and GitHub
  should make it easy to check the check the integrity of an npm package against
  a git tag


## Responding to dependency hijacks

When a hijacked dependency versions is found the required response is similar to
any other dependency insecurity:
- A patched version (normally) needs to be released
- All users of the dependency need to be informed as quickly as possible
- All users should almost always needs to upgrade to the patched version

This is one area where we already have great tools to help us. GitHub's Security
Alerts, the Node Security Working Group, and npm's own security database all
provide data to inform users of new vulnerabilities.

Dependabot consumes that security data and automatically creates pull requests
to upgrade our users to patched versions the moment a vulnerability is
announced. It provides details of the vulnerability being fixed in the PR
description, alongside the diff, release notes and any changelog entry.

**Our recommendations:**
- Use Dependabot to automatically receive fix PRs for any insecure dependencies
  (transitive or direct). Other services like [Snyk](snyk) also exist for some
  languages, but we're biased on this one 🤖

---

<a name="footnote1">[1]</a>: On average JavaScript applications pull in 24x more
transitive dependencies than direct ones. This is considerably higher than for
other languages:

|                    | Direct dependencies | Indirect dependencies | Total |
|--------------------|---------------------|-----------------------|-------|
| Ruby               | 38                  | 87                    | 125   |
| Python (Pipenv)    | 35                  | 33                    | 68    |
| PHP                | 16                  | 57                    | 73    |
| Rust               | 12                  | 86                    | 98    |
| JavaScript         | 30                  | 712                   | 742   |

Source: *Applications monitored by Dependabot*

[npm-event-stream-writeup]: https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident
[eslint-scope-attack]: https://eslint.org/blog/2018/07/postmortem-for-malicious-package-publishes
[fictional-pr-approved-attack]: https://hackernoon.com/im-harvesting-credit-card-numbers-and-passwords-from-your-site-here-s-how-9a8cb347c5b5
[jazzband]: https://jazzband.co/
[event-stream-commit]: https://github.com/dominictarr/event-stream/commit/e3163361fed01384c986b9b4c18feb1fc42b8285
[snyk]: https://snyk.io/
