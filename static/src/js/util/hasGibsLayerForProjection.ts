import projectionCodes from '../constants/projectionCodes'

type GIBSLayer = {
  /** Is the GIBS layer available in the arctic projection */
  arctic?: boolean
  /** Is the GIBS layer available in the geographic projection */
  geographic?: boolean
  /** Is the GIBS layer available in the antarctic projection */
  antarctic?: boolean
}

const hasGibsLayerForProjection = (gibsLayer: GIBSLayer, projection: string): boolean => {
  if (projection === projectionCodes.arctic && gibsLayer.arctic) return true
  if (projection === projectionCodes.geographic && gibsLayer.geographic) return true
  if (projection === projectionCodes.antarctic && gibsLayer.antarctic) return true

  return false
}

export default hasGibsLayerForProjection
