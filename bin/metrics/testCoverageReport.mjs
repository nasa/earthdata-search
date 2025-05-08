// This endpoint will give coverage for a specific commit
// https://codecov.io/api/v2/github/nasa/repos/earthdata-search/commits/<commit>
// https://docs.codecov.com/reference/repos_commits_retrieve

// Coverage is at response.totals.coverage

import fs from 'fs'

// Get the `--commit` argument from the command line
const args = process.argv.slice(2)
const commitArg = args.find((arg) => arg.startsWith('--commit='))
const commit = commitArg ? commitArg.split('=')[1] : null

const url = `https://codecov.io/api/v2/github/nasa/repos/earthdata-search/commits/${commit}`

const response = await fetch(url, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
if (!response.ok) {
  throw new Error(`Error fetching Codecov data: ${response.statusText}`)
}

// Get the coverage data from the response
const data = await response.json()
const { totals } = data
const { coverage } = totals

// Save the coverage data to a file
const coverageFilePath = 'testCoverageReport.json'
const coverageFileContent = JSON.stringify({
  testCoverageReport: coverage
})

fs.writeFileSync(coverageFilePath, coverageFileContent, 'utf-8')
