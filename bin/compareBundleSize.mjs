import fs from 'fs'
import Handlebars from 'handlebars'

const mainPath = 'main-build-output.txt'
const branchPath = 'branch-build-output.txt'
const templatePath = '.github/bundle-size-comment-template.md'
const outputPath = 'bundle-size-comment.md'

const goodStyle = 'color: #116329; background-color: #dafbe1;'
const badStyle = 'color: #82071e; background-color: #ffebe9;'

const parseFile = (filePath, prefix) => {
  // Read the file
  const fileContent = fs.readFileSync(filePath, 'utf8')

  let buildTime
  let numFiles = 0
  let totalSize = 0
  let indexJsSize = 0
  let indexJsGzipSize = 0
  let indexCssSize = 0
  let indexCssGzipSize = 0

  // Parse the text into a JSON object
  fileContent.split('\n').forEach((line) => {
    if (line.includes('built in')) {
      const [,,, time] = line.split(' ')

      buildTime = parseFloat(time.replace('s', ''))

      return
    }

    const lineParts = line.split(' ').filter(Boolean)

    if (lineParts[0]?.startsWith('static/dist')) {
      numFiles += 1

      const [
        name,
        size,
        // eslint-disable-next-line no-unused-vars
        _sizeUnit,
        // eslint-disable-next-line no-unused-vars
        _pipe,
        // eslint-disable-next-line no-unused-vars
        _gzip,
        gzipSize,
        // eslint-disable-next-line no-unused-vars
        _gzipSizeUnit
      ] = lineParts

      const parsedSize = parseFloat(size?.replace(',', ''))
      const parsedGzipSize = parseFloat(gzipSize?.replace(',', '')) || 0

      totalSize += parsedSize
      if (name.endsWith('.js') && name.startsWith('static/dist/assets/index-')) {
        indexJsSize += parsedSize
        indexJsGzipSize += parsedGzipSize
      }

      if (name.endsWith('.css') && name.startsWith('static/dist/assets/index-')) {
        indexCssSize += parsedSize
        indexCssGzipSize += parsedGzipSize
      }
    }
  })

  return {
    [prefix]: {
      buildDetails: fileContent,
      buildTime,
      numFiles,
      totalSize: parseFloat(totalSize.toFixed(2)),
      indexJsSize: parseFloat(indexJsSize.toFixed(2)),
      indexJsGzipSize: parseFloat(indexJsGzipSize.toFixed(2)),
      indexCssSize: parseFloat(indexCssSize.toFixed(2)),
      indexCssGzipSize: parseFloat(indexCssGzipSize.toFixed(2))
    }
  }
}

const mainBundleSize = parseFile(mainPath, 'main')
const branchBundleSize = parseFile(branchPath, 'branch')

const values = {
  ...mainBundleSize,
  ...branchBundleSize,
  goodStyle,
  badStyle
}

values.diff = {
  indexJsSize: parseFloat((values.branch.indexJsSize - values.main.indexJsSize).toFixed(2)),
  indexJsGzipSize: parseFloat((values.branch.indexJsGzipSize - values.main.indexJsGzipSize).toFixed(2)),
  indexCssSize: parseFloat((values.branch.indexCssSize - values.main.indexCssSize).toFixed(2)),
  indexCssGzipSize: parseFloat((values.branch.indexCssGzipSize - values.main.indexCssGzipSize).toFixed(2)),
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
