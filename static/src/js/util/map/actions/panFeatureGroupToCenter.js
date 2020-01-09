import { panBoundsToCenter } from './panBoundsToCenter'

/**
 * Pans the Leaflet map to the center with padding.
 * @param {Object} map - An instance of the Leaflet map.
 * @param {Object} featureGroup - The feature group to be centered.
 */
export const panFeatureGroupToCenter = (map, featureGroup) => {
  if (!featureGroup.getBounds) return
  const bounds = featureGroup.getBounds()
  panBoundsToCenter(map, bounds)
}
