/**
 * Convert a bounding box (2 points) to a polygon (4 points)
 * @param {Array} bbox Array of 2 [lng, lat] points
 */
export const bboxToPolygon = (bbox) => {
  const [swPoint, nePoint] = bbox
  const [swLng, swLat] = swPoint
  const [neLng, neLat] = nePoint

  // Polygons points need to be in CCW direction (ne, nw, sw, se)
  return [[
    [neLng, neLat],
    [swLng, neLat],
    [swLng, swLat],
    [neLng, swLat],
    [neLng, neLat] // Close the polygon by repeating the first point
  ]]
}
