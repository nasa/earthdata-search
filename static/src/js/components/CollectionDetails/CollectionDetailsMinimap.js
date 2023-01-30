import React from 'react'
import { PropTypes } from 'prop-types'
import {
  MapContainer,
  ImageOverlay
} from 'react-leaflet'

import CollectionDetailsFeatureGroup from './CollectionDetailsFeatureGroup'

import crsProjections from '../../util/map/crs'

import MapThumb from '../../../assets/images/plate_carree_earth_scaled@2x.png'
import './CollectionDetailsMinimap.scss'

export const CollectionDetailsMinimap = ({ metadata }) => (
  <MapContainer
    className="collection-details-minimap"
    minZoom={0}
    maxZoom={0}
    zoom={0}
    center={[0, 0]}
    crs={crsProjections.simpleScaled(1)}
    zoomControl={false}
    attributionControl={false}
    dragging={false}
    touchZoom={false}
    doubleClickZoom={false}
    scrollWheelZoom={false}
    tap={false}
  >
    <ImageOverlay
      url={MapThumb}
      bounds={[[-90, -180], [90, 180]]}
    />
    <CollectionDetailsFeatureGroup metadata={metadata} />
  </MapContainer>
)

CollectionDetailsMinimap.propTypes = {
  metadata: PropTypes.shape({}).isRequired
}

export default CollectionDetailsMinimap
