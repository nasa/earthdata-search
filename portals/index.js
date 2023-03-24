const portals = [
  'above',
  'ai-ml',
  'airmoss',
  'amd',
  'carve',
  'cwic',
  'default',
  'edsc',
  'example',
  'ghrc',
  'idn',
  'ornldaac',
  'podaac',
  'podaac-cloud',
  'soos',
  'standardproducts',
  'suborbital'
]

const output = {}

portals.forEach((portalId) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const config = require(`../portals/${portalId}/config.json`)

  output[portalId] = {
    ...config,
    portalId
  }
})

export const availablePortals = output

export default output
