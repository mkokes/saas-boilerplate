---
layout: post
title:  "Postmortem: GitHub commit display bug"
date:   2018-02-08 08:00:00 +0100
---

On February 6th, 2018, a GitHub user set `support@dependabot.com` as their
GitHub email address, which caused Dependabot's commits to appear to be attached
to their account. The issue is now resolved, cannot recur, and was only a
display bug. A full post-mortem is below:

- At 16:23 UTC the GitHub user [@0897726477][user] set `support@dependabot.com`
  as their GitHub email address. As the owner of the email address, Dependabot
  was sent an email verification email from GitHub
- At 16:37 UTC I read the email above and immediately forwarded it to GitHub
  support, informing them that no-one at Dependabot had signed up for GitHub
  with the support email address. Neither I nor anyone else clicked to confirm
  the email address
- At 17:39 UTC a customer emailed Dependabot, informing us that Dependabot’s
  commit icon was appearing as the user's avatar, and that our commits
  were linking to that user's account
- At 18:26 UTC I read the email above and realised GitHub’s commit author logic
  was being affected by the match with the (unverified) email address
- At 18:28 UTC GitHub replied to my original email asking if I would like the
  `support@dependabot.com` email address removed from the user's account
- At 18:31 UTC I replied to GitHub confirming that I would like the email
  address removed, and explained that Dependabot commits were currently linking
  to that account
- At 19:09 UTC GitHub support removed the email address from the user's
  account. I immediately registered a new account with the
  `support@dependabot.com` email address to safeguard it

After the immediate issue was fixed, I started digging into whether any
security breach had occurred. Clearly the user would not have gained any access
over any repos Dependabot operates on, but I wanted to be certain they would not
have been able to see any private Dependabot commits.

Happily, after testing this myself and asking GitHub, I can confirm that the
user would not have been able to see any private commits created by Dependabot.
As a result, the scope of this incident is limited to having caused a display
bug. Here are some reassuring words from GitHub:

> Apologies again for the worry and frustration this has caused both you and
> your users. While 0897726477 was shown as the author of those commits,
> absolutely no information about them or your repositories would have been
> shared with that individual.

To ensure this issue can't recur Dependabot will register GitHub accounts for
any email addresses it uses. We also recommend that GitHub only use verified
email addresses when linking commits to accounts.

[user]: https://github.com/@0897726477
