import WMTSTileGrid from 'ol/tilegrid/WMTS'

import projections from './projections'

const resolutionMap = {
  [projections.geographic]: {
    '16km': 3,
    '2km': 6,
    '1km': 7,
    '500m': 8,
    '250m': 9,
    '31.25m': 12,
    '15.625m': 13
  },
  [projections.arctic]: {
    '1km': 4,
    '500m': 5,
    '250m': 6,
    '31.25m': 9
  },
  [projections.antarctic]: {
    '1km': 4,
    '500m': 5,
    '250m': 6
  }
}

export const getTileGrid = (projectionCode, resolution) => {
  // Setting the correct resolutions ensures that we don't attempt to load tiles that don't exist
  // for the current projection and zoom level.
  // This allows for loading a page at zoom level 20 and the map loading the GIBS imagery for zoom level 13
  // and stretching it to fit.
  const resolutionLength = resolutionMap[projectionCode][resolution]

  if (projectionCode === projections.geographic) {
    return new WMTSTileGrid({
      origin: [-180, 90],
      resolutions: Array.from({ length: resolutionLength }, (v, k) => 0.5625 / 2 ** k),
      matrixIds: Array.from({ length: resolutionLength }, (v, k) => k.toString()),
      tileSize: 512
    })
  }

  if (projectionCode === projections.arctic || projectionCode === projections.antarctic) {
    return new WMTSTileGrid({
      origin: [-4194304, 4194304],
      resolutions: Array.from({ length: resolutionLength }, (v, k) => 16384 / 2 ** k),
      matrixIds: Array.from({ length: resolutionLength }, (v, k) => k.toString()),
      tileSize: 512
    })
  }

  return null
}
