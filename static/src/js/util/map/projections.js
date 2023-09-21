const projections = {
  arctic: 'epsg3413',
  geographic: 'epsg4326',
  antarctic: 'epsg3031'
}

export const hasGibsLayerForProjection = (gibsLayer, projection) => {
  if (projection === projections.arctic && gibsLayer.arctic) return true
  if (projection === projections.geographic && gibsLayer.geographic) return true
  if (projection === projections.antarctic && gibsLayer.antarctic) return true
  return false
}

export default projections
