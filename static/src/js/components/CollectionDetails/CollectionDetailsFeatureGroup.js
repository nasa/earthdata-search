import {
  MapLayer,
  withLeaflet
} from 'react-leaflet'

import { buildLayer } from '../../util/map/layers'

export class FeatureGroup extends MapLayer {
  createLeafletElement({ metadata }) {
    const featureGroup = buildLayer({ color: '#54F7A3', fillOpacity: 0.4, weight: 1 }, metadata)
    return featureGroup
  }
}

export default withLeaflet(FeatureGroup)
