import WMTSTileGrid from 'ol/tilegrid/WMTS'

import projectionCodes from '../../constants/projectionCodes'
import { ProjectionCode } from '../../types/sharedTypes'

// For each projection and resolution, returns the number of zoom levels available
// This data was derived from wv.json. Within that json, `sources.GIBS:geographic.matrixsSets.16km.resolutions`
// contains the number of zoom levels available for the 16km resolution in the geographic projection (3).
const resolutionMap: Record<string, Record<string, number>> = {
  [projectionCodes.geographic]: {
    '16km': 3,
    '2km': 6,
    '1km': 7,
    '500m': 8,
    '250m': 9,
    '31.25m': 12,
    '15.625m': 13
  },
  [projectionCodes.arctic]: {
    '1km': 4,
    '500m': 5,
    '250m': 6,
    '31.25m': 9
  },
  [projectionCodes.antarctic]: {
    '1km': 4,
    '500m': 5,
    '250m': 6
  }
}

/**
 * Returns a WMTSTileGrid for the given projection and resolution
 * @param {String} projectionCode The projection code for the current map projection
 * @param {String} resolution The resolution of the imagery to be displayed
 */
export const getTileGrid = (projectionCode: ProjectionCode, resolution: string): WMTSTileGrid => {
  // Setting the correct resolutions ensures that we don't attempt to load tiles that don't exist
  // for the current projection and zoom level.
  // This allows for loading a page at zoom level 20 and the map loading the GIBS imagery for zoom level 13
  // and stretching it to fit.
  const resolutionLength = resolutionMap[projectionCode][resolution]

  if (projectionCode === projectionCodes.geographic) {
    return new WMTSTileGrid({
      origin: [-180, 90],
      // Starting value of 0.5625 is found here
      // https://github.com/nasa-gibs/gibs-web-examples/blob/main/examples/openlayers/geographic-epsg4326.js
      resolutions: Array.from({ length: resolutionLength }, (v, k) => 0.5625 / 2 ** k),
      matrixIds: Array.from({ length: resolutionLength }, (v, k) => k.toString()),
      tileSize: 512
    })
  }

  if (projectionCode === projectionCodes.arctic || projectionCode === projectionCodes.antarctic) {
    return new WMTSTileGrid({
      // Origin and resolution values found here
      // https://github.com/nasa-gibs/gibs-web-examples/blob/main/examples/openlayers/arctic-epsg3413.js
      // https://github.com/nasa-gibs/gibs-web-examples/blob/main/examples/openlayers/antarctic-epsg3031.js
      origin: [-4194304, 4194304],
      resolutions: Array.from({ length: resolutionLength }, (v, k) => 8192.0 / 2 ** k),
      matrixIds: Array.from({ length: resolutionLength }, (v, k) => k.toString()),
      tileSize: 512
    })
  }

  throw new Error(`Unsupported projection code: ${projectionCode}`)
}
