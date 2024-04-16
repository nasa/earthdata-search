import aboveConfig from './above/config.json'
import aiMlConfig from './ai-ml/config.json'
import airmossConfig from './airmoss/config.json'
import amdConfig from './amd/config.json'
import carveConfig from './carve/config.json'
import caseiConfig from './casei/config.json'
import cwicConfig from './cwic/config.json'
import defaultConfig from './default/config.json'
import edscConfig from './edsc/config.json'
import exampleConfig from './example/config.json'
import ghrcConfig from './ghrc/config.json'
import idnConfig from './idn/config.json'
import obdaacConfig from './obdaac/config.json'
import ornldaacConfig from './ornldaac/config.json'
import podaacConfig from './podaac/config.json'
import podaacCloudConfig from './podaac-cloud/config.json'
import seabassConfig from './seabass/config.json'
import snwgConfig from './snwg/config.json'
import soosConfig from './soos/config.json'
import standardproductsConfig from './standardproducts/config.json'
import suborbitalConfig from './suborbital/config.json'

const output = {}

Object.assign(output, {
  above: {
    ...aboveConfig,
    portalId: 'above'
  },
  aiMl: {
    ...aiMlConfig,
    portalId: 'ai-ml'
  },
  airmoss: {
    ...airmossConfig,
    portalId: 'airmoss'
  },
  amd: {
    ...amdConfig,
    portalId: 'amd'
  },
  carve: {
    ...carveConfig,
    portalId: 'carve'
  },
  casei: {
    ...caseiConfig,
    portalId: 'casei'
  },
  cwic: {
    ...cwicConfig,
    portalId: 'cwic'
  },
  default: {
    ...defaultConfig,
    portalId: 'default'
  },
  edsc: {
    ...edscConfig,
    portalId: 'edsc'
  },
  example: {
    ...exampleConfig,
    portalId: 'example'
  },
  ghrc: {
    ...ghrcConfig,
    portalId: 'ghrc'
  },
  idn: {
    ...idnConfig,
    portalId: 'idn'
  },
  obdaac: {
    ...obdaacConfig,
    portalId: 'obdaac'
  },
  ornldaac: {
    ...ornldaacConfig,
    portalId: 'ornldaac'
  },
  podaac: {
    ...podaacConfig,
    portalId: 'podaac'
  },
  'podaac-cloud': {
    ...podaacCloudConfig,
    portalId: 'podaac-cloud'
  },
  seabass: {
    ...seabassConfig,
    portalId: 'seabass'
  },
  snwg: {
    ...snwgConfig,
    portalId: 'snwg'
  },
  soos: {
    ...soosConfig,
    portalId: 'soos'
  },
  standardproducts: {
    ...standardproductsConfig,
    portalId: 'standardproducts'
  },
  suborbital: {
    ...suborbitalConfig,
    portalId: 'suborbital'
  }
})

export const availablePortals = output
export default output
