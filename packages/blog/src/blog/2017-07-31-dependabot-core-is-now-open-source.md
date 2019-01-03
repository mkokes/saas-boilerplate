---
layout: post
title:  "Dependabot's core logic is now open-source"
date:   2017-07-31 10:30:11 +0100
---

We've open-sourced [Dependabot Core][dependabot-core], the core logic behind
Dependabot. Full details are in the project's readme.

### What does it do?

Dependabot Core is a collection of helper classes for automating dependency
updating. Some of that's trivial, but other bits are quite involved:

- Checking for the latest version of a dependency *that's resolvable given a
  project's other dependencies*. With Ruby or PHP (and in future Python) that
  means tapping into Bundler or Composer's dependency resolution logic
- Generating lockfiles for the updated dependency version. For update pull
  requests to be as useful as possible they need to be equivalent to doing the
  update locally, but for Dependabot to be fast, and not cost $$$ to host, it
  needs to avoid actually doing an install whilst generating the updated files
- Finding changelogs and release notes. This is done by looking for source code
  links in the the dependency's registry entry, and then scouring those links
  for details about the new release.

Dependabot Core is built to be able to do the above for a range of languages
(currently Ruby, JavaScript, PHP and Python). It has base classes for logic
that is shared across them, which helps enforce a simple mental model for how
the update process works. For logic bespoke to a language, it has the
architecture in place to shell out to the required language.

### Why open source it?

As the name suggests, Dependabot Core is pretty core to Dependabot - the rest of
our app is pretty much just a UI and database. If we were paranoid about someone
stealing our nascent business then we'd be keeping it under lock and key.

We're open-sourcing Dependabot Core because we're more interested in it having
an impact than we are in making a buck from it. We'd love you to use
[Dependabot][dependabot], so that we can continue to develop it, but if you want
to build and host your own version this library should make doing so a *lot*
easier.

If you use Dependabot Core we'd love to hear about what you build!

[dependabot]: https://dependabot.com
[dependabot-core]: https://github.com/dependabot/dependabot-core
