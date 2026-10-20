# Contributing to Earthdata Search

Thanks for your interest in contributing to Earthdata Search! We appreciate the community's help in making this tool better.

Earthdata Search is actively developed and maintained by an internal team alongside an internal roadmap. To ensure your time is well spent and aligns with our upcoming work, please follow the guidelines below.

## Before You Write Code

**Please do not submit a Pull Request without prior discussion.** Because we have internal roadmaps and upcoming architectural changes that may not be public yet, we want to ensure your work won't conflict with our planned development.

1. **Search existing issues and PRs** to see if your idea or bug is already being addressed.
2. **Open a new GitHub Issue** to propose your change, report a bug, or request a feature. There should be a 1:1 ratio of request to issue. Please do not lump requests together as that makes tracking them more difficult.
3. **Wait for a maintainer to respond.** We will review your issue, discuss the approach, and confirm if it aligns with our roadmap. If approved, we will track it internally and give you the green light to begin development. Our team will put the ticket into our own backlog and if a solution has not been proposed by the time we are ready to work it ourselves, then we will work it.

## Making Changes

Once an issue has been discussed and approved by the maintainers, please use the following process if you intend to develop a solution:

1. Fork this repository to your personal account.
2. Create a branch and make your changes.
3. Test the changes locally/in your personal fork.
4. Submit a Pull Request and link it to the original GitHub Issue.
5. The maintainers will review your PR, request changes if necessary, and ultimately merge it when our current sprint capacity allows. 

*(Note: Because our internal sprint schedules are planned in advance, it may take some time for us to formally review and merge external PRs. We appreciate your patience!)*

## Commits

Our ticketing and CI/CD tools are configured to sync statuses amongst each other. Commits play an important role in this process. 

Please start all commits with the internal EDSC ticket number associated with your feature, task, or bug. **(A maintainer will provide this `EDSC-XXXX` number to you during the initial Issue discussion).** 

Any pull requests without the EDSC-XXXX number will be closed.

All commit messages should follow the format: `EDSC-XXXX: [Your commit message here]`

## Disclaimer

The Earthdata Search development team will review all pull requests submitted. To be considered and/or accepted, pull requests must:
* Align with our current internal product roadmap and architectural direction.
* Meet the standard of quality set forth by existing code.
* Follow the patterns set forth by existing code.
* Adhere to the design patterns set forth by existing UI elements.

For general tips on open source contributions, see [Contributing to Open Source on GitHub](https://guides.github.com/activities/contributing-to-open-source/).