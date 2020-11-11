
import { configToCmrQuery } from './configToCmrQuery'

/**
 * Construct an object from product information provided world view that Earthdata Search can use to tag CMR collections
 * @param {Object} layer A layer object from the Worldviews JSON configuration
 */
export const constructLayerTagData = (layer) => {
  const layerTagData = []

  const {
    format,
    group,
    id,
    product,
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

  const { query } = product

  if (query.dayNightFlag) {
    match.day_night_flag = query.dayNightFlag
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

  const {
    nrt,
    science
  } = query

  if (nrt || science) {
    Object.keys(query).forEach((queryKey) => {
      layerTagData.push({
        collection: configToCmrQuery(query[queryKey]),
        data: tagData
      })
    })
  } else {
    layerTagData.push({
      collection: configToCmrQuery(query),
      data: tagData
    })
  }

  return layerTagData
}
