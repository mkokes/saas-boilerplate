---
layout: post
title:  "New feature: option for lockfile updates only"
date:   2018-02-20 10:00:00 +0000
---

We just shipped a new feature: an option to only receive lockfile-only updates.
🎉

Many languages split dependency management into a manifest file and a lockfile.
For these languages, Dependabot's creates PRs that update the requirement in the
manifest file (if necessary) as well as the version in the lockfile. Doing so
ensures our users are always aware of new major versions and review their
manifest files regularly.

Most of the time the behaviour above is exactly what you want. Occasionally,
however, we've had users ask to only receive PRs for updates that don't require
a change to their manifest file. Generally there's a business reason for this
(e.g., an agency has contracted a different fee for different update types).

Now, Dependabot can support the above "lockfile-only" flow, too. We've added it
as an "advanced option" when adding Dependabot to a repo - if you need it, it's
there for you.

<p class="image-medium">
  <img alt="Lockfile only updates" style="max-width: 480px;" src="images/only-lockfile-updates.png">
</p>

Happy dependency updating!

🍸
