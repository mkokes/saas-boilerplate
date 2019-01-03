---
layout: post
title:  "Sonatype OSS Index integration"
date:   2018-08-30 04:00:00 +0100
---

Dependabot now checks Sonatype's [OSS Index][oss-index] when looking for
vulnerable dependency versions. As a result, vulnerable Java and .NET
dependencies will now recieve update PRs immediately, with details of the
vulnerability being fixed.

<p class="image-medium">
  <img src="images/sonatype.svg" alt="Sonatype" height="100px" />
</p>

Dependabot has [automatically responded to security advisories][automatically-respond-to-security-advisories]
since April, but before today didn't have a sources for Java or .NET
vulnerabilities. Integrating with Sonatype's OSS Index changes that - it
includes details of thousands of Java and .NET vulnerabilities, as well as
advisories for Ruby, Python, PHP and JS.

Beyond the immediate benefit of expanding the vulnerability data Dependabot has
access to, we're also thrilled to be working with [Sonatype][sonatype]. They're
experts in the dependency security space, and we're excited about working
together to make the world a little more secure.

Stay safe out there!

🕵️‍♀️

[oss-index]: https://ossindex.sonatype.org/
[automatically-respond-to-security-advisories]: ../automatically-respond-to-security-advisories
[sonatype]: https://www.sonatype.com/
