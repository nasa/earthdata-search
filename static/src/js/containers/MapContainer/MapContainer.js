/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import 'proj4'
import 'proj4leaflet'
import {
  Map,
  LayersControl,
  ScaleControl
} from 'react-leaflet'

import '../../util/map/sphericalPolygon'

import LayerBuilder
  from '../../components/Map/LayerBuilder'
import ConnectedSpatialSelectionContainer
  from '../SpatialSelectionContainer/SpatialSelectionContainer'
import GranuleGridLayer
  from '../../components/Map/GranuleGridLayer'
import ZoomHome
  from '../../components/Map/ZoomHome'
import ProjectionSwitcher
  from '../../components/Map/ProjectionSwitcher'

import crsProjections from '../../util/map/crs'
import projections from '../../util/map/projections'

import actions from '../../actions/index'

import 'leaflet/dist/leaflet.css'
import './MapContainer.scss'

const { BaseLayer, Overlay } = LayersControl

const mapDispatchToProps = dispatch => ({
  onChangeMap: query => dispatch(actions.changeMap(query))
})

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  granules: state.searchResults.granules,
  map: state.map,
  masterOverlayPanelHeight: state.ui.masterOverlayPanel.height,
  pathname: state.router.location.pathname
})

export class MapContainer extends Component {
  constructor(props) {
    super(props)

    this.handleMoveend = this.handleMoveend.bind(this)
    this.handleBaseLayerChange = this.handleBaseLayerChange.bind(this)
    this.handleOverlayChange = this.handleOverlayChange.bind(this)
    this.handleProjectionSwitching = this.handleProjectionSwitching.bind(this)
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    this.controlContainer = ReactDOM
      .findDOMNode(this.mapRef)
      .querySelector('.leaflet-control-container')

    if (this.controlContainer) {
      this.onMasterOverlayPanelResize()
    }
  }

  componentDidUpdate() {
    const { masterOverlayPanelHeight } = this.props
    const {
      leafletElement: map = null
    } = this.mapRef

    if (this.mapRef) {
      map.invalidateSize()
    }

    if (this.controlContainer) {
      this.onMasterOverlayPanelResize(masterOverlayPanelHeight)
    }
  }

  onMasterOverlayPanelResize(newHeight) {
    this.controlContainer.style.bottom = `${newHeight}px`
  }

  handleMoveend(event) {
    const map = event.target
    const center = map.getCenter()
    const { lat, lng } = center
    const zoom = map.getZoom()

    const { onChangeMap } = this.props
    onChangeMap({
      latitude: lat,
      longitude: lng,
      zoom
    })
  }

  handleBaseLayerChange(event) {
    const { onChangeMap } = this.props
    const base = {
      blueMarble: false,
      trueColor: false,
      landWaterMap: false
    }

    if (event.name === 'Blue Marble') base.blueMarble = true
    if (event.name === 'Corrected Reflectance (True Color)') base.trueColor = true
    if (event.name === 'Land / Water Map *') base.landWaterMap = true

    onChangeMap({ base })
  }

  handleOverlayChange(event) {
    const { map, onChangeMap } = this.props
    const { overlays } = map

    const enabled = event.type === 'overlayadd'
    switch (event.name) {
      case 'Borders and Roads *':
        overlays.referenceFeatures = enabled
        break
      case 'Coastlines':
        overlays.coastlines = enabled
        break
      case 'Place Labels *':
        overlays.referenceLabels = enabled
        break
      default:
        break
    }

    onChangeMap({ overlays })
  }

  handleProjectionSwitching(projection) {
    const { onChangeMap } = this.props
    const map = {
      latitude: 0,
      longitude: 0,
      projection,
      zoom: 2
    }

    if (projection === projections.arctic) {
      map.latitude = 90
      map.zoom = 0
    }

    if (projection === projections.antarctic) {
      map.latitude = -90
      map.zoom = 0
    }

    this.mapRef.leafletElement.options.crs = crsProjections[projection]
    onChangeMap({ ...map })
  }

  render() {
    const {
      map,
      collections,
      focusedCollection,
      granules,
      pathname
    } = this.props

    const {
      base,
      latitude,
      longitude,
      overlays,
      projection,
      zoom
    } = map

    const isProjectPage = pathname.startsWith('/project')

    const center = [latitude, longitude]

    const maxZoom = projection === projections.geographic ? 7 : 4

    if (this.mapRef) this.mapRef.leafletElement.options.crs = crsProjections[projection]

    return (
      <Map
        className="map"
        center={center}
        zoom={zoom}
        maxZoom={maxZoom}
        crs={crsProjections[projection]}
        ref={(ref) => { this.mapRef = ref }}
        zoomControl={false}
        attributionControl={false}
        onMoveend={this.handleMoveend}
        onBaselayerChange={this.handleBaseLayerChange}
        onOverlayAdd={this.handleOverlayChange}
        onOverlayRemove={this.handleOverlayChange}
        zoomAnimation={false}
      >
        <LayersControl position="bottomright" ref={(r) => { this.controls = r }}>
          <BaseLayer
            checked={base.blueMarble}
            name="Blue Marble"
          >
            <LayerBuilder
              projection={projection}
              product="BlueMarble_ShadedRelief_Bathymetry"
              resolution="500m"
              format="jpeg"
            />
          </BaseLayer>
          <BaseLayer
            checked={base.trueColor}
            name="Corrected Reflectance (True Color)"
          >
            <LayerBuilder
              projection={projection}
              product="VIIRS_SNPP_CorrectedReflectance_TrueColor"
              resolution="250m"
              format="jpeg"
              time
            />
          </BaseLayer>
          <BaseLayer
            checked={base.landWaterMap}
            name="Land / Water Map *"
          >
            <LayerBuilder
              projection={projection}
              product="OSM_Land_Water_Map"
              resolution="250m"
              format="png"
            />
          </BaseLayer>
          <Overlay
            checked={overlays.referenceFeatures}
            name="Borders and Roads *"
          >
            <LayerBuilder
              projection={projection}
              product="Reference_Features"
              resolution="250m"
              format="png"
            />
          </Overlay>
          <Overlay
            checked={overlays.coastlines}
            name="Coastlines"
          >
            <LayerBuilder
              projection={projection}
              product="Coastlines"
              resolution="250m"
              format="png"
            />
          </Overlay>
          <Overlay
            checked={overlays.referenceLabels}
            name="Place Labels *"
          >
            <LayerBuilder
              projection={projection}
              product="Reference_Labels"
              resolution="250m"
              format="png"
            />
          </Overlay>
        </LayersControl>
        <GranuleGridLayer
          collections={collections}
          focusedCollection={focusedCollection}
          isProjectPage={isProjectPage}
          granules={granules}
        />
        <ZoomHome />
        {
          !isProjectPage && (
          <ProjectionSwitcher onChangeProjection={this.handleProjectionSwitching} />
          )
        }
        <ScaleControl position="bottomright" />
        <ConnectedSpatialSelectionContainer mapRef={this.mapRef} />
      </Map>
    )
  }
}

MapContainer.defaultProps = {
  map: {}
}

MapContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  map: PropTypes.shape({}),
  masterOverlayPanelHeight: PropTypes.number.isRequired,
  pathname: PropTypes.string.isRequired,
  onChangeMap: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
