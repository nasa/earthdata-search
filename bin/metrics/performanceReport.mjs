import fs from 'fs'

const { env } = process
const { GOOGLE_TOKEN } = env

// Get the `--env` argument from the command line
const args = process.argv.slice(2)
const envArg = args.find((arg) => arg.startsWith('--env='))
const envFromArg = envArg ? envArg.split('=')[1] : 'prod'

const urlEnv = envFromArg === 'uat' ? '.uat' : ''
const urlWithEnv = `https://search${urlEnv}.earthdata.nasa.gov`

const today = new Date().toISOString().split('T')[0]

const getPageSpeedInsights = async (url, strategy) => {
  // Request the PageSpeed Insights API
  const response = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=${strategy}&key=${GOOGLE_TOKEN}&category=performance&category=accessibility&category=best-practices&category=seo`
  )
  if (!response.ok) {
    throw new Error(`Error fetching PageSpeed Insights: ${response.statusText}`)
  }

  const data = await response.json()
  const { lighthouseResult } = data
  const { audits, categories } = lighthouseResult

  const {
    'largest-contentful-paint': lcp = {},
    'interaction-to-next-paint-insight': inp = {},
    'cumulative-layout-shift': cls = {},
    'first-contentful-paint': fcp = {},
    'server-response-time': ttfb = {}
  } = audits

  const { numericValue: lcpValue } = lcp
  const { numericValue: inpValue } = inp
  const { numericValue: clsValue } = cls
  const { numericValue: fcpValue } = fcp
  const { numericValue: ttfbValue } = ttfb

  // Truncate the numeric values to 2 decimal places
  const lcpValueTruncated = lcpValue ? Math.round(lcpValue * 100) / 100 : 'No value'
  const inpValueTruncated = inpValue ? Math.round(inpValue * 100) / 100 : 'No value'
  const clsValueTruncated = clsValue ? Math.round(clsValue * 100) / 100 : 'No value'
  const fcpValueTruncated = fcpValue ? Math.round(fcpValue * 100) / 100 : 'No value'
  const ttfbValueTruncated = ttfbValue ? Math.round(ttfbValue * 100) / 100 : 'No value'

  const {
    performance,
    accessibility,
    'best-practices': bestPractices,
    seo
  } = categories
  const { score: performanceScore } = performance
  const { score: accessibilityScore } = accessibility
  const { score: bestPracticesScore } = bestPractices
  const { score: seoScore } = seo

  return {
    accessibilityScore: accessibilityScore * 100,
    bestPracticesScore: bestPracticesScore * 100,
    cls: clsValueTruncated,
    date: today,
    fcp: fcpValueTruncated,
    inp: inpValueTruncated,
    lcp: lcpValueTruncated,
    performanceScore: performanceScore * 100,
    seoScore: seoScore * 100,
    strategy,
    ttfb: ttfbValueTruncated
  }
}

// Define the reports to generate
const reports = [{
  environment: envFromArg,
  strategy: 'desktop',
  url: urlWithEnv
}, {
  environment: envFromArg,
  strategy: 'mobile',
  url: urlWithEnv
}]

// Loop through the reports and generate them
const reportsPromises = reports.map(async (report) => {
  const { strategy, url } = report

  const metrics = await getPageSpeedInsights(url, strategy)

  return metrics
})

Promise.all(reportsPromises)
  .then((values) => {
    const mergedValues = {
      [envFromArg]: {
        desktop: values.find((report) => report.strategy === 'desktop'),
        mobile: values.find((report) => report.strategy === 'mobile')
      }
    }

    // Write the reports to a JSON file
    const reportsFilePath = `${envFromArg}PerformanceReport.json`
    const reportsFileContent = JSON.stringify(mergedValues)
    fs.writeFileSync(reportsFilePath, reportsFileContent, 'utf-8')
  })
  .catch((error) => {
    console.error('Error generating reports:', error)
  })
