import { getValueForTag } from '../tags'

export const buildGibsLayers = (json) => {
  const availableLayers = []

  const gibsTag = getValueForTag('gibs', json.tags)

  if (!gibsTag) return ['None']

  if (gibsTag[0].antarctic) availableLayers.push('Antarctic')
  if (gibsTag[0].arctic) availableLayers.push('Arctic')
  if (gibsTag[0].geo) availableLayers.push('Geographic')

  if (!availableLayers.length) availableLayers.push('None')

  return availableLayers.join(', ')
}

export default buildGibsLayers
