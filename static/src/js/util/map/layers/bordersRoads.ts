import VectorTileLayer from 'ol/layer/VectorTile'
import VectorTileSource from 'ol/source/VectorTile'
import { TileGrid as OlTileGridTileGrid } from 'ol/tilegrid'
import MVT from 'ol/format/MVT'
import { Projection } from 'ol/proj'
import { stylefunction } from 'ol-mapbox-style'

import projectionCodes from '../../../constants/projectionCodes'
import { ProjectionCode } from '../../../types/sharedTypes'

import bordersStyleConfig from './bordersStyleConfig.json'
import { crsProjections } from '../crs'

/**
 * Builds the standard resolution Borders and Roads layer using OSM data from GIBS
 * @param {Object} params
 * @param {String} params.projectionCode The projection code for the layer
 * @param {String} params.visible The visibility flag for the layer
 */
const bordersRoads = ({
  projectionCode,
  visible
}: {
  /** The projection code for the layer */
  projectionCode: ProjectionCode
  /** The visibility flag for the layer */
  visible: boolean
}) => {
  // If the projection code is not geographic, return null because the VectorTileLayer can not be reprojected
  if (projectionCode !== projectionCodes.geographic) return null

  const projection = crsProjections[projectionCode] as Projection

  const resolutions = [
    0.5625,
    0.28125,
    0.140625,
    0.0703125,
    0.03515625,
    0.017578125,
    0.0087890625,
    0.00439453125,
    0.002197265625,
    0.0010986328125,
    0.00054931640625,
    0.00027465820313,
    0.0001373291015625
  ]

  const tileSource = new VectorTileSource({
    attributions: 'U.S. Department of State, Office of the Geographer and Global Issues',
    format: new MVT(),
    projection,
    tileGrid: new OlTileGridTileGrid({
      resolutions,
      tileSize: [512, 512],
      origin: [-180, 90]
    }),
    url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=1970-01-01T00:00:00Z&layer=DoS_International_Boundaries&tilematrixset=15.625m&Service=WMTS&Request=GetTile&Version=1.0.0&FORMAT=application%2Fvnd.mapbox-vector-tile&TileMatrix={z}&TileCol={x}&TileRow={y}',
    wrapX: false
  })

  const layer = new VectorTileLayer({
    className: 'borders-roads-layer',
    source: tileSource,
    renderMode: 'vector',
    visible
  })

  stylefunction(layer, bordersStyleConfig, 'DoS_International_Boundaries', resolutions)

  return layer
}

export default bordersRoads
