---
layout: post
title:  "Fixing Bundler's dependency resolution algorithm and making it 2x faster"
date:   2017-08-03 10:30:11 +0100
---

A month ago we had a report of some strange behaviour from Dependabot: on some
projects, we were creating a "Dependabot can't resolve your Ruby dependency
files" issue, only to immediately close it. Hunting down that bug took me right
to the core of Bundler's dependency resolution logic, and I spent three weeks
working to improve it.

Happily, the result is a 2x speedup for Bundler's resolution logic and a bunch
of fixes that mean it now has no known bugs.

### The bug

First up, some quick, relevant info about how Dependabot surfaced the issue:

- Dependabot creates pull requests for any outdated dependencies in a
project's `Gemfile`. It's a little like running `bundle update <dependency>` for
each dependency
- To do so, Dependabot piggy-backs off of Bundler's resolution logic. (If you're
curious, the logic is [open source][dependabot-resolution].)
- If Bundler raises an error during resolution,  Dependabot catches it,
categorises it, and creates a relevant issue on the project's repository.

The bug we were seeing was that `bundle update <dependency>` would raise
a `VersionConflict` error, whilst a clean `bundle install` would execute just
fine. That shouldn't happen. Ever.

A quick look at the Bundler repo surfaced [these][bundler-issue-1]
[issues][bundler-issue-2] and gave me certainty the bug was somewhere in
Bundler's resolution logic. Fortunately, that resolution logic is extracted out
into its own gem, [Molinillo][molinillo]. Time to get bug hunting...

### The naive approach (and failure)

To start out with, I thought I might be able to find a simple mistake in
Molinillo, without really needing to get to know it. I created a
[pull request][failed-pr] that got the tests passing and fixed my issue locally.
Job done, right? Sadly not. Patching Dependabot with my "fix" caused the same
error to occur on a *different* set of Gemfiles! Arghhh! Clearly I didn't know
what I was doing, and was going to need to if I was going to fix this bug.

### OK, so how's this thing supposed to work?

Time to get to know Molinillo, and dependency resolution in general,
properly. Thankfully, Samuel Giddins, who wrote Molinillo, also wrote a
[guide to its architecture][architecture-guide]. I can't begin to explain how
useful that guide was - thanks Samuel!

Fundamentally, Molinillo resolves dependencies using a backtracking algorithm.
If, like me, you have no idea what that is, here's the mental model that I used
when thinking about it:

- Take each "requirement" from a project's `Gemfile` and `Gemfile.lock` and put
them in a big array. Each requirement will relate to a single dependency
- Dynamically build a "tree" from the requirements array as follows:
  - Pick a requirement from the array (intelligently, but more on that later)
  to become a node in the tree
  - For each dependency version that satisfies the requirement, as well as all
  previously considered requirements for the dependency, draw an edge coming out
  of the node. Each edge then represents setting the constrained dependency to
  that version
  - Pick the highest version edge, add it's sub-dependency requirements (i.e.,
  those in its `gemspec`) to the requirements array, and add a new node to its
  other end, repeating the current process to do so
- If at any point there are no possible dependency versions for a newly added
node, backtrack to a previous node and explore a different edge of the tree
- Resolution is complete when either
  - The requirements array is exhausted, in which case we have a successful
  resolution. Since we've always been picking the highest version edges first
  this must be one of the highest version resolutions possible
  - There are no possible dependency versions for the current node, and
  nowhere to backtrack to. In this case, our initial requirements were
  unresolvable

Sound simple? It is. But without some speedups, it might also be incredibly
slow - the number of possible branches in the tree above grows exponentially
with the number of requirements. To keep things fast we want to explore as few
of those branches as possible, whilst still guaranteeing we find the best
resolution, if one exists.

### So, where's the bug?

Armed with my new knowledge of backtracking it was time to confront the
Molinillo codebase again. For a resolvable `Gemfile` to be failing to resolve,
the bug was most likely to be in the backtracking step - we were probably
backtracking too far and discarding valid branches of the tree.

It turns out that the logic to calculate optimal backtracking is pretty
complicated. Struggling to wrap my head around the existing implementation, I
decided on the obvious course of action: yak shave. A couple of hours in I had
things in a shape I understood much better, and was even able to create a pull
request with some [minor improvements][minor-improvements-pr]. It's about this
time I had an idea for a big speedup, unrelated to the original bug.

### Speeding things up: grouping

Remember the backtracking algorithm I described earlier, where I described
creating a new edge for each valid dependency version, and then picking the
highest version edge to work on from then on? I realised there was a big speedup
to be had by grouping the edges together, and considering several of them at
once.

The logic here is simple: if two versions of a dependency have identical
sub-dependency requirements, they're basically equivalent in the algorithm
previously described, and can be considered as a group. Since the requirements
in a dependency's `gemspec` generally don't change between versions, the groups
will often be quite large, and the number of groups for each node quite small.
If we have to backtrack and explore lots of different edges, being able to
consider whole groups at a time will thus save a lot of iterations.

I had a prototype working in a couple of hours, and some basic benchmarks
showing a 10x speedup for some gnarly cases, but there was red all over the
codebase. Unsure if it could ever be mergeable I created a
[pull request][grouping-pr] and asked Samuel for help.

That's when things got collaborative. Samuel gave me a host of pointers, which
I powered through, and then took ownership of making sure the change worked with
Bundler / CocoaPods - something that would have taken me forever. Within a few
hours things were looking much less proof of concept, and the speedup merged a
couple of days later. I can't credit Samuel enough for making that happen - he
made working on the project a pleasure.

### Back to the bug

Well, that was fun, but I still hadn't fixed the bug. No way was I going to let
it beat me now I had an understanding of the codebase...

Before I started on all that speedup work I'd been pretty certain the bug I was
hunting was in the way Molinillo decided which node to backtrack to. Time to
dig into the theory behind optimal backtracking. Unfortunately there was no
section in the architecture guide for this, so I was going to have to write
it myself. Here's the basics:

- We need to backtrack when there are no dependency versions that would satisfy
the current node's requirement, combined with all previous node's
requirements for that dependency
- The node we should backtrack to is first one that has an edge that gives us
a possibility of avoiding the present conflict

Simple? Well, yeah - everything's simple when it's high enough level. The detail
on this one is fiendishly complicated, though - figuring out whether an edge has
a possibility of avoiding the conflict we're rewinding from is hard.
Here's what Molinillo did before my changes:

- Consider the current requirement. Before it, there was no conflict. Find the
node where an edge was chosen that brought it into existence (i.e., where it
was a sub-dependency constraint of the dependency version chosen). Check if we
could have chosen a different version there, or for the parent of that node,
etc., etc.
- Similarly, consider the first requirement for the dependency in conflict. This
is where we chose the current grouping of edges, which now contains no elements
that satisfy all the subsequent requirements (hence the conflict). Could we have
chosen a different grouping of edges?
- Backtrack to whichever node from the above is highest up the tree

Pretty sensible. After hours of staring at debug output, though, I realised it
was missing some potentially conflict-resolving edges:

- The current requirement may not be binding on its own. Suppose the initial
requirement was `x >= 1.0`, the second requirement was `x < 2.0` and the third
requirement was `x > 2.0`. Relaxing *either* the second or the third requirement
would potentially fix the conflict, but with Molinillo's original logic,
relaxing the second requirement wouldn't be considered
- We might only have got to the current requirement via a previous conflict,
that could have been unwound differently. This case is so horribly complicated
you're probably best off just reading the [spec][spec-pr] to understand it

Great. Add a fix for those and we're sorted, right? Well, yes, as long as it's
fast. Which my first attempts were not - considering all those other vertices
led to lots of shorter unwinds that weren't previously happening, and ended up
yielding the same conflict. I'd made Molinillo "correct", but painfully slow.

### Speeding things up again: filtering

How can we be "correct" at the same time as being fast? I bashed my head against
the keyboard for another few days. Then eventually I came up with filtering.

Here's the theory (it's generic to any backtracking algorithm):

- At the point when a conflict occurs, we have more information than at the
point we selected the edges that form our current branch: we now know that the
choices we made combine to cause the current conflict
- We can use this information to filter a node's edges when considering it as a
candidate for backtracking to. Simply having alternative edges to explore isn't
enough - we need those edges not to create the same set of requirements that is
currently conflicting
- Then, after choosing a node to backtrack to and backtracking to it, we can
apply the filtering we used during the decision process to actually remove the
edges we know will lead us to the same confict as before

Applying the above filtering process makes Molinillo just as snappy with the
fixes previously discussed as it was before their application. Here's the
[pull request][fix-pr] that makes it all happen.

### Job done

And with those changes, Molinillo can resolve anything that's thrown at it,
fast. Which means Bundler can. Which means Dependabot can. 🎉

Want some benchmarks? Of course you do:

|                                                  |Molinillo 0.5.7|Molinillo 0.6.1|
|--------------------------------------------------|---------------|---------------|
|Iterations (vertices added) during spec suite run |25,307         |3,521          |
|Time to run (original) spec suite 100 times       |467 seconds    |220 seconds    |

✌️

### Thanks

I'd like to say a huge thanks to [Samuel Giddins][segiddins] for all his help
over the last few weeks. There is absolutely no way I could have achieved the
above without him.

### A quick ask

Want to help support Bundler? Check out [Ruby Together][ruby-together].

Want to help support me? Give [Dependabot][dependabot] a try. It's totally free
for individuals.

[bundler-issue-1]: https://github.com/bundler/bundler/issues/5569
[bundler-issue-2]: https://github.com/bundler/bundler/issues/5633
[molinillo]: https://github.com/CocoaPods/Molinillo
[failed-pr]: https://github.com/CocoaPods/Molinillo/pull/66
[minor-improvements-pr]: https://github.com/CocoaPods/Molinillo/pull/67
[grouping-pr]: https://github.com/CocoaPods/Molinillo/pull/69
[fix-pr]: https://github.com/CocoaPods/Molinillo/pull/73
[spec-pr]: https://github.com/CocoaPods/Resolver-Integration-Specs/pull/13
[architecture-guide]: https://github.com/CocoaPods/Molinillo/blob/master/ARCHITECTURE.md
[segiddins]: https://github.com/segiddins
[ruby-together]: https://rubytogether.org/
[dependabot]: https://dependabot.com/
[dependabot-resolution]: https://github.com/dependabot/dependabot-core/blob/v0.11.2/lib/dependabot/update_checkers/ruby/bundler.rb#L63-L77
