import { getValueForTag } from '../../../../../sharedUtils/tags'

/**
 * Build a string to represent the available gibs layers for the provided collection metadata
 * @param {Object} collectionJson The metadata in json format from CMR
 */
export const buildGibsLayers = (collectionJson) => {
  const availableLayers = []

  const { tags } = collectionJson

  // Exract the gibs tags from the collection metadata
  const gibsTag = getValueForTag('gibs', tags)

  // If there is no gibs tag, return a human readable string
  if (!gibsTag) return 'None'

  if (gibsTag[0].antarctic) availableLayers.push('Antarctic')
  if (gibsTag[0].arctic) availableLayers.push('Arctic')
  if (gibsTag[0].geographic) availableLayers.push('Geographic')

  // If there are available layers but none of them apply to EDSC
  if (!availableLayers.length) availableLayers.push('None')

  return availableLayers.join(', ')
}

export default buildGibsLayers
