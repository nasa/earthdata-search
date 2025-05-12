import fs from 'fs'

// Given an input environment (e.g., `prod` or `uat`), this script reads the version from a JSON file and determines which reports are needed.

// Get the `--env` argument from the command line
const args = process.argv.slice(2)
const envArg = args.find((arg) => arg.startsWith('--env='))
const env = envArg ? envArg.split('=')[1] : 'prod'

// Get the `--version` argument from the command line
const versionArg = args.find((arg) => arg.startsWith('--version='))
const versionFromArg = versionArg ? versionArg.split('=')[1] : null
// If the version is provided as an argument, use it
const version = versionFromArg

// Read the reports JSON file
const reportsFilePath = './metrics-branch/metrics.json'
const reportsFileContent = fs.readFileSync(reportsFilePath, 'utf8')
const reportsFile = JSON.parse(reportsFileContent)

// The metrics file is keyed by the version without the build number.
// Strip the -<build number> from the version string
const versionWithoutBuild = version.split('-')[0]

// Get the report for the version
const versionReport = reportsFile[versionWithoutBuild]

// Reach each report from the versionReport
const {
  bundleSize,
  cloc,
  performance = {},
  testCoverage
} = versionReport || {}

const { [env]: performanceByEnv } = performance

// These console logs will be set to Github Actions outputs to be used by jobs later in the workflow.
// Any additional console logs in this file will break the workflow.
// If the report is not found, the `needs_*` variable will be `true`, indicating that the report is needed
console.log(`needs_bundle_size=${!!bundleSize}`)
console.log(`needs_cloc=${!!cloc}`)
console.log(`needs_performance=${!!performanceByEnv}`)
console.log(`needs_test_coverage=${!!testCoverage}`)

const performanceMatrix = []
if (!performanceByEnv) {
  performanceMatrix.push(env)
}

console.log(`performance_matrix=${JSON.stringify(performanceMatrix)}`)
