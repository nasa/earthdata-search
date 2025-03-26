import TileLayer from 'ol/layer/Tile'
import { XYZ } from 'ol/source'
import { createXYZ } from 'ol/tilegrid'
import { crsProjections, projectionConfigs } from '../crs'

/**
 * Get either today's date or yesterday's date, depending on data availability
 * GIBS typically has a 1-day delay
 * @return {String} Date in YYYY-MM-DD format
 */
const getTodayOrYesterday = () => {
  const today = new Date()
  // GIBS usually has a 1-day delay in data availability
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  return yesterday.toISOString().split('T')[0]
}

/**
 * Map our projection codes to GIBS projection identifiers
 * @param {String} projectionCode Our projection code
 * @return {String} GIBS projection identifier
 */
const getGibsProjection = (projectionCode) => {
  const projectionMap = {
    epsg4326: 'epsg4326',
    epsg3413: 'epsg3413', // Arctic
    epsg3031: 'epsg3031' // Antarctic
  }

  return projectionMap[projectionCode] || 'epsg4326'
}

/**
 * Builds the Corrected Reflectance (True Color) layer
 * @param {Object} params
 * @param {String} params.attributions Attribution for the layer
 * @param {String} params.projectionCode The projection code for the layer
 * @param {String} params.date The date for the imagery in YYYY-MM-DD format (defaults to yesterday)
 */
const correctedReflectance = ({
  attributions,
  projectionCode,
  date = getTodayOrYesterday()
}) => {
  const projection = crsProjections[projectionCode]
  const gibsProjection = getGibsProjection(projectionCode)

  const layer = new TileLayer({
    className: 'edsc-map-base-layer',
    source: new XYZ({
      attributions,
      maxResolution: 180 / 512,
      projection,
      reprojectionErrorThreshold: 2,
      tileGrid: createXYZ({
        extent: projection.getExtent(),
        maxResolution: 576 / 512,
        maxZoom: projectionConfigs[projectionCode].maxZoom
      }),
      tileSize: 512,
      url: `https://gibs.earthdata.nasa.gov/wmts/${gibsProjection}/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${date}/250m/{z}/{y}/{x}.jpeg`,
      wrapX: false
    }),
    visible: false
  })

  return layer
}

export default correctedReflectance
