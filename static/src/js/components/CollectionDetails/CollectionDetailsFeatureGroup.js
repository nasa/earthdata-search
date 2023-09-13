import { createLayerComponent } from '@react-leaflet/core'

import { buildLayer } from '../../util/map/layers'

const createLayer = (props, context) => {
  const { metadata } = props
  const featureGroup = buildLayer({ color: '#54F7A3', fillOpacity: 0.4, weight: 1 }, metadata)

  return { instance: featureGroup, context }
}

export default createLayerComponent(createLayer)
