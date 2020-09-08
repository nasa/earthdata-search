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
import { difference } from 'lodash'

import actions from '../../actions/index'

import { metricsMap } from '../../middleware/metrics/actions'

import crsProjections from '../../util/map/crs'
import projections from '../../util/map/projections'
import murmurhash3 from '../../util/murmurhash3'

import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getFocusedCollectionGranuleResults } from '../../selectors/collectionResults'
import { getGranulesMetadata } from '../../selectors/granuleMetadata'
import { isPath } from '../../util/isPath'

import ConnectedSpatialSelectionContainer from '../SpatialSelectionContainer/SpatialSelectionContainer'
import GranuleGridLayer from '../../components/Map/GranuleGridLayer'
import GranuleImageContainer from '../GranuleImageContainer/GranuleImageContainer'
import LayerBuilder from '../../components/Map/LayerBuilder'
import MouseEventsLayer from '../../components/Map/MouseEventsLayer'
import ProjectionSwitcher from '../../components/Map/ProjectionSwitcher'
import ShapefileLayer from '../../components/Map/ShapefileLayer'
import ZoomHome from '../../components/Map/ZoomHome'

import '../../util/map/sphericalPolygon'

import 'leaflet/dist/leaflet.css'
import './MapContainer.scss'

const { BaseLayer, Overlay } = LayersControl

const mapDispatchToProps = dispatch => ({
  onChangeFocusedGranule:
    granuleId => dispatch(actions.changeFocusedGranule(granuleId)),
  onChangeMap: query => dispatch(actions.changeMap(query)),
  onExcludeGranule:
    data => dispatch(actions.excludeGranule(data)),
  onFetchShapefile: id => dispatch(actions.fetchShapefile(id)),
  onSaveShapefile: data => dispatch(actions.saveShapefile(data)),
  onShapefileErrored: data => dispatch(actions.shapefileErrored(data)),
  onMetricsMap: type => dispatch(metricsMap(type)),
  onToggleTooManyPointsModal:
    state => dispatch(actions.toggleTooManyPointsModal(state)),
  onUpdateShapefile: data => dispatch(actions.updateShapefile(data))
})

const mapStateToProps = state => ({
  authToken: state.authToken,
  collectionsMetadata: state.metadata.collections,
  focusedCollectionId: getFocusedCollectionId(state),
  focusedGranuleId: getFocusedGranuleId(state),
  granuleSearchResults: getFocusedCollectionGranuleResults(state),
  granulesMetadata: getGranulesMetadata(state),
  map: state.map,
  project: state.project,
  router: state.router,
  shapefile: state.shapefile
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

  componentDidMount() {
    // Resize the Leaflet controls container when the component map mounts,
    // and any time the browser is resized
    this.resizeLeafletControls()
    window.addEventListener('resize', this.resizeLeafletControls)
  }

  componentDidUpdate() {
    const {
      leafletElement: map = null
    } = this.mapRef

    if (this.mapRef) {
      map.invalidateSize()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeLeafletControls)
  }

  onMapReady(e) {
    const { target: map } = e

    this.controlContainer = map._controlContainer
    const layersControl = this.controlContainer.querySelector('.leaflet-control-layers-list')

    const attributionElement = document.createElement('footer')
    attributionElement.classList.add('leaflet-control-layers-attribution')
    attributionElement.innerHTML = '* © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    layersControl.appendChild(attributionElement)
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

  /**
   * Sets the height of the leaflet controls. This is needed so they do not
   * fall behind the footer.
   */
  resizeLeafletControls() {
    if (!document) return

    const leafletControlContainer = document.querySelector('.leaflet-control-container')
    const routeWrapper = document.querySelector('.route-wrapper')

    // If the control container and the route wrapper are defined, set the leaflet controls to
    // the same height as the route wrapper.
    if (leafletControlContainer && routeWrapper) {
      leafletControlContainer.style.height = `${routeWrapper.clientHeight}px`
    }
  }

  render() {
    const {
      authToken,
      map,
      collectionsMetadata,
      focusedCollectionId,
      focusedGranuleId,
      granuleSearchResults,
      granulesMetadata,
      project,
      router,
      shapefile,
      onChangeFocusedGranule,
      onExcludeGranule,
      onFetchShapefile,
      onSaveShapefile,
      onShapefileErrored,
      onMetricsMap,
      onToggleTooManyPointsModal,
      onUpdateShapefile
    } = this.props

    const {
      base,
      latitude,
      longitude,
      overlays,
      projection,
      zoom
    } = map

    const { location } = router
    const { pathname } = location
    const isProjectPage = isPath(pathname, '/projects')

    const center = [latitude, longitude]

    const maxZoom = projection === projections.geographic ? 7 : 4

    let nonExcludedGranules
    if (focusedCollectionId && granuleSearchResults) {
      const { allIds, excludedGranuleIds, isCwic } = granuleSearchResults
      const allGranuleIds = allIds

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
        nonExcludedGranules.byId[granuleId] = granulesMetadata[granuleId]
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
          collectionsMetadata={collectionsMetadata}
          focusedCollectionId={focusedCollectionId}
          focusedGranuleId={focusedGranuleId}
          granulesMetadata={granulesMetadata}
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
        <ShapefileLayer
          authToken={authToken}
          isProjectPage={isProjectPage}
          shapefile={shapefile}
          onFetchShapefile={onFetchShapefile}
          onSaveShapefile={onSaveShapefile}
          onShapefileErrored={onShapefileErrored}
          onMetricsMap={onMetricsMap}
          onToggleTooManyPointsModal={onToggleTooManyPointsModal}
          onUpdateShapefile={onUpdateShapefile}
        />
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
  collectionsMetadata: PropTypes.shape({}).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  granuleSearchResults: PropTypes.shape({}).isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  map: PropTypes.shape({}),
  project: PropTypes.shape({}).isRequired,
  router: PropTypes.shape({}).isRequired,
  shapefile: PropTypes.shape({}).isRequired,
  onChangeFocusedGranule: PropTypes.func.isRequired,
  onChangeMap: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFetchShapefile: PropTypes.func.isRequired,
  onSaveShapefile: PropTypes.func.isRequired,
  onShapefileErrored: PropTypes.func.isRequired,
  onMetricsMap: PropTypes.func.isRequired,
  onToggleTooManyPointsModal: PropTypes.func.isRequired,
  onUpdateShapefile: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
