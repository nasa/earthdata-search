/**
 * This file reads from the list of portals and combines all the configs into a single JSON file (git ignored).
 * This file is set up to run as an npm script on 'postinstall' and 'prestart'.
 * This should ensure that the availablePortals.json file is present in CI
 * environments, and updates to the file will be available in your local
 * environment after restarting the dev server.
 */

const fs = require('fs')

// When adding a new portal, add your config file to the `portals` directory, and
// list the name of the portal here. The order does not matter, but please keep
// them sorted alphabetically!
const portals = [
  'above',
  'ai-ml',
  'airmoss',
  'amd',
  'carve',
  'casei',
  'cwic',
  'default',
  'edsc',
  'example',
  'ghrc',
  'idn',
  'obdaac',
  'ornldaac',
  'podaac',
  'podaac-cloud',
  'seabass',
  'snwg',
  'soos',
  'standardproducts',
  'suborbital'
]

const availablePortals = {}

// Loop through each portal config and add contents to the `availablePortals` object
portals.forEach((portalId) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const config = require(`../portals/${portalId}/config.json`)

  availablePortals[portalId] = {
    ...config,
    portalId
  }
})

try {
  // Write the availablePortals.json file
  fs.writeFileSync('portals/availablePortals.json', JSON.stringify(availablePortals))
} catch (error) {
  console.error(error)

  throw error
}
