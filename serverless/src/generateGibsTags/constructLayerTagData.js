/**
 * Construct an object from product information provided world view that Earthdata Search can use to tag CMR collections
 * @param {Object} layer A layer object from the Worldviews JSON configuration
 */
export const constructLayerTagData = (layer) => {
  const layerTagData = []

  const {
    conceptIds = [],
    daynight = [],
    format,
    group,
    id,
    projections,
    subtitle,
    title
  } = layer

  const match = {}
  if (layer.startDate) {
    match.time_start = `>=${layer.startDate}`
  }
  if (layer.endDate) {
    match.time_end = `<=${layer.endDate}`
  }

  if (daynight.length > 0) {
    // This used to be a string but is now an array, just using the first value until
    // we can discuss with the Worldview team
    const [firstDayNightValue] = daynight

    match.day_night_flag = firstDayNightValue
  }

  const tagData = {
    match,
    product: id,
    group,
    // maxNativeZoom: 5,
    title,
    source: subtitle,
    format: format.split('/').pop(),
    updated_at: new Date().toISOString()
  }

  const supportedProjections = ['antarctic', 'arctic', 'geographic']
  supportedProjections.forEach((projection) => {
    const layerProjection = projections[projection]
    if (layerProjection) {
      const resolution = layerProjection.matrixSet.split('_').pop()

      tagData[projection] = true
      tagData[`${projection}_resolution`] = resolution
    } else {
      tagData[projection] = false
      tagData[`${projection}_resolution`] = null
    }
  })

  conceptIds.forEach((collection) => {
    const { value } = collection
    layerTagData.push({
      collection: {
        condition: {
          concept_id: value
        }
      },
      data: tagData
    })
  })

  return layerTagData
}
