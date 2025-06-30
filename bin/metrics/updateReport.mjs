import fs from 'fs'

// This script reads the reports created from previous jobs and updates the metrics-test.json file in the metrics-branch.

// Get the `--version` argument from the command line
const args = process.argv.slice(2)
const versionArg = args.find((arg) => arg.startsWith('--version='))
const version = versionArg ? versionArg.split('=')[1] : null

// Get the `--commit` argument from the command line
const commitArg = args.find((arg) => arg.startsWith('--commit='))
const commit = commitArg ? commitArg.split('=')[1] : null

// Get each file from metrics-reports
const reports = {}

// Create the reports directory if it doesn't exist
const reportsDirectory = 'metrics-reports'
if (!fs.existsSync(reportsDirectory)) {
  fs.mkdirSync(reportsDirectory)
}

try {
  const reportsFiles = fs.readdirSync(reportsDirectory)

  // If no reports files are found, exit the script
  if (reportsFiles.length === 0) {
    console.log('No reports found in metrics-reports directory.')
    process.exit(0)
  }

  reportsFiles.forEach((file) => {
    const filePath = `${reportsDirectory}/${file}`
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const fileName = file.replace('.json', '')
    reports[fileName] = JSON.parse(fileContent)
  })
} catch (error) {
  console.error('Error reading reports in metrics-reports directory.', error)

  // If no reports are found, exit the script
  process.exit(1)
}

// The cloc report is a different format than the other reports, reformat it to match
// the other reports if it exists
if (reports.clocReport) {
  reports.clocReport = {
    clocReport: reports.clocReport
  }
}

// Add each value in reports to the metrics-branch/metrics-test.json file
const metricsFilePath = 'metrics-branch/metrics-test.json'
const metricsFileContent = fs.readFileSync(metricsFilePath, 'utf8')
const metricsFile = JSON.parse(metricsFileContent)

// The metrics file is keyed by the version without the build number.
// Strip the -<build number> from the version string
const versionWithoutBuild = version.split('-')[0]

const updatedMetricsFile = {
  ...metricsFile,
  [versionWithoutBuild]: {
    version,
    date: new Date().toISOString().split('T')[0],
    ...metricsFile[versionWithoutBuild],
    commit,
    ...(reports.bundleSizeReport || {}),
    ...(reports.clocReport || {}),
    ...(reports.testCoverageReport || {}),
    performanceReport: {
      ...(metricsFile[versionWithoutBuild]?.performanceReport || {}),
      ...(reports.uatPerformanceReport || {}),
      ...(reports.prodPerformanceReport || {})
    }
  }
}

// Write the updated metrics file to the metrics-branch/metrics-test.json file
fs.writeFileSync(metricsFilePath, JSON.stringify(updatedMetricsFile, null, 2), 'utf-8')
