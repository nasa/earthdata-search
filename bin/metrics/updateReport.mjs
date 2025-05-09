import fs from 'fs'

// This script reads the reports created from previous jobs and updates the metrics.json file in the metrics-branch.

// Get the `--version` argument from the command line
const args = process.argv.slice(2)
const versionArg = args.find((arg) => arg.startsWith('--version='))
const version = versionArg ? versionArg.split('=')[1] : null

// Get the `--commit` argument from the command line
const commitArg = args.find((arg) => arg.startsWith('--commit='))
const commit = commitArg ? commitArg.split('=')[1] : null

// Get each file from metrics-reports
const reports = {}

try {
  const reportsDirectory = 'metrics-reports'
  const reportsFiles = fs.readdirSync(reportsDirectory)

  reportsFiles.forEach((file) => {
    const filePath = `${reportsDirectory}/${file}`
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const fileName = file.replace('.json', '')
    reports[fileName] = JSON.parse(fileContent)
  })
} catch (error) {
  console.log('No reports found in metrics-reports directory.', error)

  // If no reports are found, exit the script
  process.exit(0)
}

// Add each value in reports to the metrics-branch/metrics.json file
const metricsFilePath = 'metrics-branch/metrics.json'
const metricsFileContent = fs.readFileSync(metricsFilePath, 'utf8')
const metricsFile = JSON.parse(metricsFileContent)

const updatedMetricsFile = {
  ...metricsFile,
  [version]: {
    date: new Date().toISOString().split('T')[0],
    ...metricsFile[version],
    commit,
    ...(reports.bundleSizeReport || {}),
    clocReport: reports.clocReport,
    ...(reports.testCoverageReport || {}),
    performanceReport: {
      ...(metricsFile[version]?.performanceReport || {}),
      ...(reports.uatPerformanceReport || {}),
      ...(reports.prodPerformanceReport || {})
    }
  }
}

// Write the updated metrics file to the metrics-branch/metrics.json file
fs.writeFileSync(metricsFilePath, JSON.stringify(updatedMetricsFile, null, 2), 'utf-8')
