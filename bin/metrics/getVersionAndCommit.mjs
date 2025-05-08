import puppeteer from 'puppeteer'

// Get the `--env` argument from the command line
const args = process.argv.slice(2)
const envArg = args.find((arg) => arg.startsWith('--env='))
const env = envArg ? envArg.split('=')[1] : 'prod'

const urlEnv = env === 'uat' ? '.uat' : ''
const urlWithEnv = `https://search${urlEnv}.earthdata.nasa.gov`

/**
 * Get the current version of the app
 */
const getVersionAndCommit = async (url) => {
  // TODO Won't need puppeteer once the version in the fallback footer makes it to prod
  // Request the URL directly to scrape the version from the footer (classname `footer__ver-pill`)
  // Set the executable path if not on a Mac
  // const executablePath = process.platform === 'darwin' ? undefined : '/usr/local/share/chromedriver-linux64'
  // const browser = await puppeteer.launch({
  //   executablePath
  // })
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle2' })
  const version = await page.evaluate(() => {
    const versionElement = document.querySelector('.footer__ver-pill')

    // Remove the `v` prefix from the version string
    if (versionElement) {
      const versionText = versionElement.innerText
      const [, versionWithoutV] = versionText.split('v')

      return versionWithoutV
    }

    return null
  })
  await browser.close()

  const { GITHUB_TOKEN } = process.env
  // Get the commit hash for the git tag that matches the version
  const gitTagResponse = await fetch('https://api.github.com/repos/nasa/earthdata-search/tags?per_page=50', {
    headers: {
      authorization: `Bearer ${GITHUB_TOKEN}`
    }
  })
  if (!gitTagResponse.ok) {
    throw new Error(`Error fetching GitHub tags: ${gitTagResponse.statusText}`)
  }

  const gitTagData = await gitTagResponse.json()
  const gitTag = gitTagData.find((tag) => tag.name === `v${version}`)
  if (!gitTag) {
    throw new Error(`Git tag not found for version: ${version}`)
  }

  const { commit } = gitTag
  const { sha: commitHash } = commit

  console.log(`version=${version}`)
  console.log(`commit=${commitHash}`)
}

getVersionAndCommit(urlWithEnv)
