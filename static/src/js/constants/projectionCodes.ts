import { crsProjections } from '../util/map/crs'

const projectionCodes: {
  arctic: keyof typeof crsProjections
  geographic: keyof typeof crsProjections
  antarctic: keyof typeof crsProjections
} = {
  arctic: 'epsg3413',
  geographic: 'epsg4326',
  antarctic: 'epsg3031'
}

export default projectionCodes
