import fs from 'fs'
import Handlebars from 'handlebars'

import parseBuildFile from './metrics/parseBuildFile.mjs'

const mainPath = 'main-build-output.txt'
const branchPath = 'branch-build-output.txt'
const templatePath = '.github/bundle-size-comment-template.md'
const outputPath = 'bundle-size-comment.md'

const goodStyle = 'color: #116329; background-color: #dafbe1;'
const badStyle = 'color: #82071e; background-color: #ffebe9;'

const mainBundleSize = parseBuildFile(mainPath, 'main')
const branchBundleSize = parseBuildFile(branchPath, 'branch')

const values = {
  ...mainBundleSize,
  ...branchBundleSize,
  goodStyle,
  badStyle
}

values.diff = {
  indexJsSize: parseFloat((values.branch.indexJsSize - values.main.indexJsSize).toFixed(2)),
  indexJsGzipSize: parseFloat(
    (values.branch.indexJsGzipSize - values.main.indexJsGzipSize).toFixed(2)
  ),
  indexCssSize: parseFloat((values.branch.indexCssSize - values.main.indexCssSize).toFixed(2)),
  indexCssGzipSize: parseFloat(
    (values.branch.indexCssGzipSize - values.main.indexCssGzipSize).toFixed(2)
  ),
  totalSize: parseFloat((values.branch.totalSize - values.main.totalSize).toFixed(2)),
  buildTime: parseFloat((values.branch.buildTime - values.main.buildTime).toFixed(2)),
  numFiles: parseFloat((values.branch.numFiles - values.main.numFiles).toFixed(2))
}

// Handlebars helpers
values.diff.isJsBigger = values.diff.indexJsSize > 0
values.diff.isJsGzipBigger = values.diff.indexJsGzipSize > 0
values.diff.isCssBigger = values.diff.indexCssSize > 0
values.diff.isCssGzipBigger = values.diff.indexCssGzipSize > 0
values.diff.isTotalBigger = values.diff.totalSize > 0
values.diff.isBuildTimeBigger = values.diff.buildTime > 0
values.diff.isNumFilesBigger = values.diff.numFiles > 0

// Read handlebars template file
const source = fs.readFileSync(templatePath, 'utf8')
const template = Handlebars.compile(source)

// Generate the output
const output = template(values)

fs.writeFileSync(outputPath, output)
