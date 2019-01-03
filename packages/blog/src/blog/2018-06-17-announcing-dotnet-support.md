---
layout: post
title:  "Announcing .NET support"
date:   2018-06-17 08:00:00 +0100
---

Using .NET? Dependabot can now help you keep the dependencies in your
project files up-to-date.

<p class="image-medium">
  <img src="images/dotnet-logo.svg" alt=".NET" height="100px" />
</p>

Here's how it works:
- Dependabot looks for a \*.csproj, \*.fsproj or \*.vbproj in your repo,
  and pulls it down.
- Dependabot extracts the dependencies from the project file and checks against
  the central NuGet repository to see if they're up-to-date.
- If any updates are available, Dependabot creates individual PRs for each of
  your outdated dependencies.

We wanted to launch .NET support as early as possible, so have released it
in alpha. As such it might be a little rough around the edges, but we'll use
your feedback to make it perfect.

If you use .NET we'd love to hear from you as we test support for it. We're
already aware that:
- ~~Dependabot doesn't yet support custom repositories. We'll be adding support
  for them soon.~~ We now fully support custom repositories. 🎉
- ~~Dependabot doesn't yet support packages.config files. Again, we'll have
  support for them very soon.~~ We now support packages.config files. 🎉

We're grateful to [Raul Hidalgo Caballero][raul] and [Asbjørn Ulsberg][asbjorn]
for their advice on .NET. Thanks guys!

If you have any suggestions, or if you experience any issues, please don't
hesitate to [let us know][feedback-link]!

✌️

[raul]: https://github.com/deinok
[asbjorn]: https://github.com/asbjornu
[feedback-link]: https://github.com/dependabot/feedback
