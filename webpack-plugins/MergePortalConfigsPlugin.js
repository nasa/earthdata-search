const fs = require('fs')

const path = require('path')

const portalDirectory = 'portals'
const mergedPortalConfigName = 'mergedPortalConfigs.json'

/**
 * Merges all the individual portal configs into portalDirectory/mergedPortalConfigName
 */
const mergeConfigs = () => {
  console.log('Merging Portal Configs')

  const output = {}
  const directories = fs.readdirSync(portalDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())

  directories.forEach((directory) => {
    const { name } = directory
    const contents = JSON.parse(fs.readFileSync(`${portalDirectory}/${name}/config.json`, 'utf8'))

    output[name] = {
      ...contents,
      portalId: name
    }
  })

  fs.writeFileSync(`${portalDirectory}/mergedPortalConfigs.json`, JSON.stringify(output))
}

// If mergedPortalConfigName doesn't exist yet, create the file.
if (!fs.existsSync(path.join(portalDirectory, mergedPortalConfigName))) {
  mergeConfigs()
}

/**
 * This plugin will create/update the merged portal configs using the watchRun hook. So the
 * merged config file will be updated when any changes occur in the individual config files
 */
export class MergePortalConfigsPlugin {
  apply(compiler) {
    compiler.hooks.watchRun.tap(
      'MergePortalConfigsPlugin',
      () => {
        mergeConfigs()
      }
    )
  }
}
