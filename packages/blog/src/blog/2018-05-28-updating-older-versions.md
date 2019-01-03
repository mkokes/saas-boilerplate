---
layout: post
title:  "Patch updates for older major versions"
date:   2018-05-28 09:00:00 +0000
---

We've improved Dependabot's version resolution logic. It can now keep you
up-to-date with patch releases to older major versions.

Say you're using Rails 4.x and know the upgrade path to 5.x isn't
straightforward for you. You'd love to do the work, but just can't prioritise
it right now.

Previously, you could close the 5.x PR and tell Dependabot to ignore that major
version. That was great, but unfortunately it didn't mean Dependabot would keep
notifying you about new 4.x releases. On the backend Dependabot was still
generating updates to the latest version for you, but then discarding them.

Now, Dependabot considers the versions you're ignoring *before* generating its
updates, rather than after. That's harder to do, because it means manipulating
each package manager's resolution logic, but it yields a big improvement:
Dependabot will now create patch/minor update PRs for repos that are tied to an
older major version.

We've been rolling the above change out language-by-language, and the improved
logic is now present for Ruby, JavaScript, PHP, Python, Elixir and Java.
~~We hope to add it to our Rust support in the next few weeks~~ Rust is now
supported too, so all Dependabot's languages include this logic.

🍸
