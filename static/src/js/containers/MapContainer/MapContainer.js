/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import 'proj4'
import 'proj4leaflet'
import L from 'leaflet'
import {
  Map,
  LayersControl,
  ScaleControl
} from 'react-leaflet'

import actions from '../../actions/index'
import ZoomHome from '../../components/map_controls/ZoomHome'

import 'leaflet/dist/leaflet.css'
import './MapContainer.scss'
import LayerBuilder from '../../components/map_controls/LayerBuilder'
import ConnectedSpatialSelectionContainer
  from '../SpatialSelectionContainer/SpatialSelectionContainer'
import GranuleGridLayer from '../../components/map_controls/GranuleGridLayer/GranuleGridLayer'

const { BaseLayer, Overlay } = LayersControl

const EPSG4326 = new window.L.Proj.CRS(
  'EPSG:4326',
  '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs', {
    origin: [-180, 90],
    resolutions: [
      0.5625,
      0.28125,
      0.140625,
      0.0703125,
      0.03515625,
      0.017578125,
      0.0087890625,
      0.00439453125,
      0.002197265625
    ],
    bounds: L.Bounds([
      [-180, -90],
      [180, 90]
    ])
  }
)
const EPSG3413 = new window.L.Proj.CRS(
  'EPSG:3413',
  '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', {
    origin: [-4194304, 4194304],
    resolutions: [
      8192.0,
      4096.0,
      2048.0,
      1024.0,
      512.0,
      256.0
    ],
    bounds: L.bounds([
      [-4194304, -4194304],
      [4194304, 4194304]
    ])
  }
)
const EPSG3031 = new window.L.Proj.CRS(
  'EPSG:3031',
  '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', {
    origin: [-4194304, 4194304],
    resolutions: [
      8192.0,
      4096.0,
      2048.0,
      1024.0,
      512.0,
      256.0
    ],
    bounds: L.Bounds([
      [-4194304, -4194304],
      [4194304, 4194304]
    ])
  }
)
const crsProjections = [EPSG3413, EPSG4326, EPSG3031]

const mapDispatchToProps = dispatch => ({
  onChangeMap: query => dispatch(actions.changeMap(query))
})

const mapStateToProps = state => ({
  mapParam: state.map.mapParam,
  focusedCollection: state.focusedCollection,
  granules: state.entities.granules
})

export class EdscMapContainer extends Component {
  constructor(props) {
    super(props)

    this.handleMoveend = this.handleMoveend.bind(this)
  }

  componentDidUpdate() {
    const {
      leafletElement: map = null
    } = this.mapRef

    if (this.mapRef) {
      map.invalidateSize()
    }
  }

  handleMoveend(event) {
    const map = event.target
    const center = map.getCenter()
    const { lat } = center
    const { lng } = center
    const zoom = map.getZoom()

    const mapParam = `${lat}!${lng}!${zoom}!1!0!0,2`

    const { onChangeMap } = this.props
    onChangeMap({ mapParam })
  }

  render() {
    const {
      mapParam,
      focusedCollection,
      granules
    } = this.props
    // const [lat, lng, zoom, proj, base, overlays] = map.split('!')
    const [lat, lng, zoom, proj] = mapParam.split('!')
    const center = [lat, lng]
    const projections = ['epsg3413', 'epsg4326', 'epsg3031']
    const projIndex = proj !== undefined ? proj : 1


    return (
      <Map
        className="map"
        center={center}
        zoom={zoom}
        maxZoom={7}
        crs={crsProjections[projIndex]}
        ref={(ref) => { this.mapRef = ref }}
        projIndex={projIndex}
        zoomControl={false}
        attributionControl={false}
        onMoveend={this.handleMoveend}
        zoomAnimation={false}
      >
        <LayersControl position="bottomright">
          <BaseLayer checked name="Blue Marble">
            <LayerBuilder
              projection={projections[projIndex]}
              product="BlueMarble_ShadedRelief_Bathymetry"
              resolution="500m"
              format="jpeg"
            />
          </BaseLayer>
          <BaseLayer name="Corrected Reflectance (True Color)">
            <LayerBuilder
              projection={projections[projIndex]}
              product="MODIS_Terra_CorrectedReflectance_TrueColor"
              resolution="250m"
              format="jpeg"
              time="2019-02-01"
            />
          </BaseLayer>
          <BaseLayer name="Land / Water Map *">
            <LayerBuilder
              projection={projections[projIndex]}
              product="OSM_Land_Water_Map"
              resolution="250m"
              format="png"
            />
          </BaseLayer>
          <Overlay checked name="Borders and Roads *">
            <LayerBuilder
              projection={projections[projIndex]}
              product="Reference_Features"
              resolution="250m"
              format="png"
            />
          </Overlay>
          <Overlay name="Coastlines">
            <LayerBuilder
              projection={projections[projIndex]}
              product="Coastlines"
              resolution="250m"
              format="png"
            />
          </Overlay>
          <Overlay checked name="Place Labels *">
            <LayerBuilder
              projection={projections[projIndex]}
              product="Reference_Labels"
              resolution="250m"
              format="png"
            />
          </Overlay>
        </LayersControl>
        <GranuleGridLayer
          focusedCollection={focusedCollection}
          granules={granules}
        />
        <ZoomHome />
        <ScaleControl position="bottomright" />
        <ConnectedSpatialSelectionContainer mapRef={this.mapRef} />
      </Map>
    )
  }
}

EdscMapContainer.defaultProps = {
  mapParam: '0!0!2!1!0!0,2',
  focusedCollection: ''
}

EdscMapContainer.propTypes = {
  mapParam: PropTypes.string,
  onChangeMap: PropTypes.func.isRequired,
  focusedCollection: PropTypes.string,
  granules: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(EdscMapContainer)
