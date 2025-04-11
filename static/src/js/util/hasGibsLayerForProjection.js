import projectionCodes from '../constants/projectionCodes'

const hasGibsLayerForProjection = (gibsLayer, projection) => {
  if (projection === projectionCodes.arctic && gibsLayer.arctic) return true
  if (projection === projectionCodes.geographic && gibsLayer.geographic) return true
  if (projection === projectionCodes.antarctic && gibsLayer.antarctic) return true

  return false
}

export default hasGibsLayerForProjection
