// This endpoint will give coverage for a specific commit
// https://codecov.io/api/v2/github/nasa/repos/earthdata-search/commits/<commit>
// https://docs.codecov.com/reference/repos_commits_retrieve

// Coverage is at response.totals.coverage

import fs from 'fs'

const getCoverage = async (commit) => {
  const url = `https://api.codecov.io/api/v2/github/nasa/repos/earthdata-search/commits/${commit}/`

  // Request the Codecov API
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  })

  if (!response.ok) {
    return false
  }

  // Get the coverage data from the response
  const data = await response.json()
  const { totals } = data
  const { coverage } = totals

  return coverage
}

const getCoverageReport = async () => {
  // Get the `--version` argument from the command line
  const args = process.argv.slice(2)
  const versionArg = args.find((arg) => arg.startsWith('--version='))
  const version = versionArg ? versionArg.split('=')[1] : null

  // Get the `--commit` argument from the command line
  const commitArg = args.find((arg) => arg.startsWith('--commit='))
  const commit = commitArg ? commitArg.split('=')[1] : null

  let coverage = await getCoverage(commit)

  // If coverage is not found, find more commits from the github tags to try
  // This will happen if the release is a backport and we don't run the tests on main
  if (!coverage) {
    // Strip the -<build number> from the version string
    const versionWithoutBuild = version.split('-')[0]
    const gitTagResponse = await fetch('https://api.github.com/repos/nasa/earthdata-search/tags?per_page=50')

    if (!gitTagResponse.ok) {
      throw new Error(`Error fetching GitHub tags: ${gitTagResponse.statusText}`)
    }

    const gitTagData = await gitTagResponse.json()

    // Find the tags that match the sprint (e.g., v25.2.2*)
    const tagsToCheck = gitTagData.filter((tag) => tag.name.startsWith(`v${versionWithoutBuild}`))

    // Iterate over the tags and get the coverage for each commit, once coverage is found, break the loop
    // Need to disable no-restricted-syntax and no-await-in-loop rules because we need to do the async calls
    // in sequential order, stopping when we find coverage

    // eslint-disable-next-line no-restricted-syntax
    for (const tag of tagsToCheck) {
      const { commit: commitObj } = tag
      const { sha: commitHash } = commitObj

      // eslint-disable-next-line no-await-in-loop
      coverage = await getCoverage(commitHash)

      // If coverage is found, break the loop
      if (coverage) {
        break
      }
    }
  }

  // If coverage is still not found, throw an error
  if (!coverage) {
    throw new Error('Coverage not found')
  }

  // Save the coverage data to a file
  const coverageFilePath = 'testCoverageReport.json'
  const coverageFileContent = JSON.stringify({
    testCoverageReport: coverage
  })

  fs.writeFileSync(coverageFilePath, coverageFileContent, 'utf-8')
}

getCoverageReport()
