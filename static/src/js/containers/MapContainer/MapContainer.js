/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import 'proj4'
import 'proj4leaflet'
import {
  Map,
  LayersControl,
  ScaleControl
} from 'react-leaflet'
import $ from 'jquery'
import { difference } from 'lodash'

import '../../util/map/sphericalPolygon'
import isPath from '../../util/isPath'
import { metricsMap } from '../../middleware/metrics/actions'

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
import GranuleImageContainer
  from '../GranuleImageContainer/GranuleImageContainer'

import crsProjections from '../../util/map/crs'
import projections from '../../util/map/projections'

import actions from '../../actions/index'

import 'leaflet/dist/leaflet.css'
import './MapContainer.scss'
import ShapefileLayer from '../../components/Map/ShapefileLayer'
import MouseEventsLayer from '../../components/Map/MouseEventsLayer'
import murmurhash3 from '../../util/murmurhash3'

const { BaseLayer, Overlay } = LayersControl

const mapDispatchToProps = dispatch => ({
  onChangeFocusedGranule:
    granuleId => dispatch(actions.changeFocusedGranule(granuleId)),
  onChangeMap: query => dispatch(actions.changeMap(query)),
  onExcludeGranule:
    data => dispatch(actions.excludeGranule(data)),
  onSaveShapefile: data => dispatch(actions.saveShapefile(data)),
  onShapefileErrored: data => dispatch(actions.shapefileErrored(data)),
  onMetricsMap: type => dispatch(metricsMap(type)),
  onToggleTooManyPointsModal:
    state => dispatch(actions.toggleTooManyPointsModal(state))
})

const mapStateToProps = state => ({
  authToken: state.authToken,
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  focusedGranule: state.focusedGranule,
  map: state.map,
  masterOverlayPanelHeight: state.ui.masterOverlayPanel.height,
  pathname: state.router.location.pathname,
  shapefile: state.shapefile,
  project: state.project
})

export class MapContainer extends Component {
  constructor(props) {
    super(props)

    this.handleMoveend = this.handleMoveend.bind(this)
    this.handleBaseLayerChange = this.handleBaseLayerChange.bind(this)
    this.handleOverlayChange = this.handleOverlayChange.bind(this)
    this.handleProjectionSwitching = this.handleProjectionSwitching.bind(this)
    this.onMapReady = this.onMapReady.bind(this)
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

  onMapReady(e) {
    const { target: map } = e

    this.controlContainer = map._controlContainer
    const layersControl = this.controlContainer.querySelector('.leaflet-control-layers-list')

    const attributionElement = document.createElement('footer')
    attributionElement.classList.add('leaflet-control-layers-attribution')
    attributionElement.innerHTML = '* © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    layersControl.appendChild(attributionElement)

    this.onMasterOverlayPanelResize()
  }

  onMasterOverlayPanelResize(newHeight) {
    const routeWrapperHeight = $('.route-wrapper').height()

    this.controlContainer.style.width = '100%'
    this.controlContainer.style.height = `${routeWrapperHeight - newHeight}px`
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
    const { onChangeMap, onMetricsMap } = this.props
    const base = {
      blueMarble: false,
      trueColor: false,
      landWaterMap: false
    }

    if (event.name === 'Blue Marble') base.blueMarble = true
    if (event.name === 'Corrected Reflectance (True Color)') base.trueColor = true
    if (event.name === 'Land / Water Map *') base.landWaterMap = true

    onMetricsMap(`Set Base Map: ${event.name}`)

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
    const { onChangeMap, onMetricsMap } = this.props
    const map = {
      latitude: 0,
      longitude: 0,
      projection,
      zoom: 2
    }

    const Projection = Object.keys(projections).find((key => (
      projections[key] === projection
    )))

    if (projection === projections.arctic) {
      map.latitude = 90
      map.zoom = 0
    }

    if (projection === projections.antarctic) {
      map.latitude = -90
      map.zoom = 0
    }

    this.mapRef.leafletElement.options.crs = crsProjections[projection]

    onMetricsMap(`Set Projection: ${Projection}`)
    onChangeMap({ ...map })
  }

  render() {
    const {
      authToken,
      map,
      collections,
      focusedCollection,
      focusedGranule,
      pathname,
      project,
      shapefile,
      onChangeFocusedGranule,
      onExcludeGranule,
      onSaveShapefile,
      onShapefileErrored,
      onMetricsMap,
      onToggleTooManyPointsModal
    } = this.props

    const {
      base,
      latitude,
      longitude,
      overlays,
      projection,
      zoom
    } = map

    const isProjectPage = isPath(pathname, '/project')

    const center = [latitude, longitude]

    const maxZoom = projection === projections.geographic ? 7 : 4

    let nonExcludedGranules
    if (focusedCollection && collections.byId[focusedCollection]) {
      const { excludedGranuleIds = [], granules } = collections.byId[focusedCollection]
      const { allIds, isCwic } = granules
      const allGranuleIds = allIds
      nonExcludedGranules = granules
      let granuleIds
      if (isCwic) {
        granuleIds = allGranuleIds.filter((id) => {
          const hashedId = murmurhash3(id).toString()
          return excludedGranuleIds.indexOf(hashedId) === -1
        })
      } else {
        granuleIds = difference(allGranuleIds, excludedGranuleIds)
      }
      nonExcludedGranules = { byId: {} }
      granuleIds.forEach((granuleId) => {
        nonExcludedGranules.byId[granuleId] = granules.byId[granuleId]
      })
    }

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
        whenReady={this.onMapReady}
      >
        <LayersControl
          position="bottomright"
          ref={(r) => {
            this.controls = r
          }}
        >
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
          focusedGranule={focusedGranule}
          isProjectPage={isProjectPage}
          granules={nonExcludedGranules}
          project={project}
          projection={projection}
          onChangeFocusedGranule={onChangeFocusedGranule}
          onExcludeGranule={onExcludeGranule}
          onMetricsMap={onMetricsMap}
        />
        <MouseEventsLayer />
        <ZoomHome />
        {
          !isProjectPage && (
          <ProjectionSwitcher onChangeProjection={this.handleProjectionSwitching} />
          )
        }
        <ScaleControl position="bottomright" />
        <ConnectedSpatialSelectionContainer mapRef={this.mapRef} />
        {
          !isProjectPage && (
          <ShapefileLayer
            authToken={authToken}
            shapefile={shapefile}
            onSaveShapefile={onSaveShapefile}
            onShapefileErrored={onShapefileErrored}
            onMetricsMap={onMetricsMap}
            onToggleTooManyPointsModal={onToggleTooManyPointsModal}
          />
          )
        }
        <GranuleImageContainer />
      </Map>
    )
  }
}

MapContainer.defaultProps = {
  map: {}
}

MapContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  focusedGranule: PropTypes.string.isRequired,
  map: PropTypes.shape({}),
  masterOverlayPanelHeight: PropTypes.number.isRequired,
  pathname: PropTypes.string.isRequired,
  project: PropTypes.shape({}).isRequired,
  shapefile: PropTypes.shape({}).isRequired,
  onChangeFocusedGranule: PropTypes.func.isRequired,
  onChangeMap: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onSaveShapefile: PropTypes.func.isRequired,
  onShapefileErrored: PropTypes.func.isRequired,
  onMetricsMap: PropTypes.func.isRequired,
  onToggleTooManyPointsModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
