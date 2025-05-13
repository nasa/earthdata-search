// Need to pull code from compareBundleSize.mjs to create the bundle size at a specific commit
import fs from 'fs'

import parseBuildFile from './parseBuildFile.mjs'

// Get the `--file` path from the command line arguments
const args = process.argv.slice(2)
const fileArg = args.find((arg) => arg.startsWith('--file='))
const filePath = fileArg ? fileArg.split('=')[1] : null

const parsedBuildFile = parseBuildFile(filePath, 'bundleSizeReport')

// Write the parsed build file to a JSON file
const bundleSizeFilePath = 'bundleSizeReport.json'
const bundleSizeFileContent = JSON.stringify(parsedBuildFile)

fs.writeFileSync(bundleSizeFilePath, bundleSizeFileContent, 'utf-8')
