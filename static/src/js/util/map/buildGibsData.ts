import projectionCodes from '../../constants/projectionCodes'

import type { GibsData, ProjectionCode } from '../../types/sharedTypes'
import type { MapLayer } from '../../zustand/types'

// Helper function to build GIBS data for a granule
const buildGibsData = (
  layersForProjection: MapLayer[],
  projection: ProjectionCode,
  timeStart: string
): GibsData[] => layersForProjection.map((layer) => {
  const {
    antarctic_resolution: antarcticResolution,
    arctic_resolution: arcticResolution,
    format,
    geographic_resolution: geographicResolution,
    layerPeriod,
    product,
    title,
    isVisible,
    opacity: layerOpacity
  } = layer

  let resolution
  if (projection === projectionCodes.antarctic) {
    resolution = antarcticResolution
  } else if (projection === projectionCodes.arctic) {
    resolution = arcticResolution
  } else {
    resolution = geographicResolution
  }

  // If the GIBS layer is "subdaily", use the full timeStart (date and time).
  // Otherwise, use only the date part of timeStart.
  const gibsTime = layerPeriod?.toLowerCase() === 'subdaily'
    ? timeStart
    : timeStart.substring(0, 10)

  return {
    format,
    layerPeriod,
    product,
    title,
    resolution,
    visible: isVisible,
    opacity: layerOpacity,
    time: gibsTime,
    url: `https://gibs-{a-c}.earthdata.nasa.gov/wmts/${projection}/best/wmts.cgi?TIME=${gibsTime}`
  } as GibsData
})
export default buildGibsData
