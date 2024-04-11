/**
 * Pans the Leaflet bounds to the center with padding.
 * @param {Object} map - An instance of the Leaflet map.
 * @param {Object} bounds - The bounds of the area to be centered.
 */
export const panBoundsToCenter = (map, bounds) => {
  if (bounds.isValid && bounds.isValid()) {
    map.fitBounds(bounds, { padding: [200, 200] }).flyTo(bounds.getCenter())
  }
}
