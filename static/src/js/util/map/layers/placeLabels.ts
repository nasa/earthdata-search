import vectorTileLayer from './vectorTileLayer'

import { ProjectionCode } from '../../../types/sharedTypes'

import placeLabelsStyleConfig from './placeLabelsStyleConfig.json'

/**
 * Builds the place labels layer
 * https://www.arcgis.com/home/item.html?id=a70340a048224752915ddbed9d2101a7
 * @param {Object} params
 * @param {String} params.projectionCode
 * @param {String} params.visible
 */
const placeLabels = async ({
  projectionCode,
  visible
}: {
  /** The projection code for the layer */
  projectionCode: ProjectionCode
  /** The visibility flag for the layer */
  visible: boolean
}) => vectorTileLayer({
  attributions: 'Sources: Esri, TomTom, Garmin, FAO, NOAA, USGS, © OpenStreetMap contributors, and the GIS User Community',
  className: 'place-labels-layer',
  projectionCode,
  style: placeLabelsStyleConfig,
  visible,
  zIndex: 5
})

export default placeLabels
