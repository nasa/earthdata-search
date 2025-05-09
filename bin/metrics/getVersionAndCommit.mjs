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
  // Request the URL to scrape the version from the footer (classname `footer__ver-pill`)

  // Use fetch to get the version from the URL
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error fetching URL: ${response.statusText}`)
  }

  const text = await response.text()
  console.log('🚀 ~ getVersionAndCommit.mjs:47 ~ getVersionAndCommit ~ text:', text)
  const versionMatch = text.match(/<span class="footer__ver-pill">v(\d+\.\d+\.\d+-\d+)<\/span>/)
  if (!versionMatch) {
    throw new Error('Version not found in the footer')
  }

  const version = versionMatch[1]

  // const { GITHUB_TOKEN } = process.env
  // Get the commit hash for the git tag that matches the version
  const gitTagResponse = await fetch('https://api.github.com/repos/nasa/earthdata-search/tags?per_page=50', {
    // headers: {
    //   authorization: `Bearer ${GITHUB_TOKEN}`
    // }
  })
  if (!gitTagResponse.ok) {
    throw new Error(`Error fetching GitHub tags: ${gitTagResponse.statusText}`)
  }

  // Incase we forget to push a tag for a backport, grab the latest tag that matches the sprint (e.g., v25.2.2*)
  // Strip the -<build number> from the version string
  const versionWithoutBuild = version.split('-')[0]

  const gitTagData = await gitTagResponse.json()
  const gitTag = gitTagData.find((tag) => tag.name.startsWith(`v${versionWithoutBuild}`))
  if (!gitTag) {
    throw new Error(`Git tag not found for version: ${versionWithoutBuild}`)
  }

  const { commit } = gitTag
  const { sha: commitHash } = commit

  console.log(`version=${version}`)
  console.log(`commit=${commitHash}`)
}

getVersionAndCommit(urlWithEnv)
