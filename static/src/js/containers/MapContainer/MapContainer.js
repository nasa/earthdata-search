import React, { useLayoutEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { difference, merge } from 'lodash'
import 'proj4leaflet'
import LRUCache from 'lrucache'

import actions from '../../actions'
import { metricsMap } from '../../middleware/metrics/actions'

import { getFocusedCollectionGranuleResults } from '../../selectors/collectionResults'
import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getGranulesMetadata } from '../../selectors/granuleMetadata'
import { getMapPreferences } from '../../selectors/preferences'
import { isPath } from '../../util/isPath'
import { locationPropType } from '../../util/propTypes/location'
import projections from '../../util/map/projections'
import murmurhash3 from '../../util/murmurhash3'
import '../../util/map/sphericalPolygon'

import 'leaflet/dist/leaflet.css'
import './MapContainer.scss'

import MapWrapper from './MapWrapper'

export const mapDispatchToProps = (dispatch) => ({
  onChangeFocusedGranule:
    (granuleId) => dispatch(actions.changeFocusedGranule(granuleId)),
  onChangeMap:
    (query) => dispatch(actions.changeMap(query)),
  onExcludeGranule:
    (data) => dispatch(actions.excludeGranule(data)),
  onFetchShapefile:
    (id) => dispatch(actions.fetchShapefile(id)),
  onSaveShapefile:
    (data) => dispatch(actions.saveShapefile(data)),
  onShapefileErrored:
    (data) => dispatch(actions.shapefileErrored(data)),
  onMetricsMap:
    (type) => dispatch(metricsMap(type)),
  onToggleTooManyPointsModal:
    (state) => dispatch(actions.toggleTooManyPointsModal(state)),
  onUpdateShapefile:
    (data) => dispatch(actions.updateShapefile(data))
})

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
  collectionsMetadata: state.metadata.collections,
  drawingNewLayer: state.ui.map.drawingNewLayer,
  focusedCollectionId: getFocusedCollectionId(state),
  focusedGranuleId: getFocusedGranuleId(state),
  granuleSearchResults: getFocusedCollectionGranuleResults(state),
  granulesMetadata: getGranulesMetadata(state),
  map: state.map,
  mapPreferences: getMapPreferences(state),
  project: state.project,
  router: state.router,
  shapefile: state.shapefile
})

export const MapContainer = (props) => {
  const {
    authToken,
    map: mapProps,
    collectionsMetadata,
    drawingNewLayer,
    focusedCollectionId,
    focusedGranuleId,
    granuleSearchResults,
    granulesMetadata,
    mapPreferences,
    project,
    router,
    onChangeMap,
    shapefile,
    onChangeFocusedGranule,
    onExcludeGranule,
    onFetchShapefile,
    onSaveShapefile,
    onShapefileErrored,
    onMetricsMap,
    onToggleTooManyPointsModal,
    onUpdateShapefile
  } = props

  const { location } = router
  const { pathname } = location
  const isProjectPage = isPath(pathname, '/projects')
  const [map, setMap] = useState(mapProps)
  const imageryCache = useRef(LRUCache(400))

  const {
    base,
    latitude,
    longitude,
    overlays,
    projection: defaultProjection,
    zoom: zoomProps
  } = map

  const [projection, setProjection] = useState(defaultProjection)
  const [center, setCenter] = useState([latitude, longitude])
  const [zoom, setZoom] = useState(zoomProps)

  useLayoutEffect(() => {
    const {
      latitude: latitudePreference,
      longitude: longitudePreference,
      projection: projectionPreference,
      zoom: zoomPreference
    } = mapPreferences

    // Format base and overlay layer preferences to before merging with the defaults
    const {
      baseLayer: baseLayerFromPreference,
      overlayLayers: overlayLayersFromPreference = []
    } = mapPreferences

    const baseLayerPreference = { [baseLayerFromPreference]: true }
    const overlayLayersPreference = {}
    overlayLayersFromPreference.forEach((layer) => {
      overlayLayersPreference[layer] = true
    })

    // Merge the current map settings with the preferences, using preferences in a parameter is not set
    const mapWithDefaults = merge(
      {
        base: baseLayerPreference,
        latitude: latitudePreference,
        longitude: longitudePreference,
        overlays: overlayLayersPreference,
        projection: projectionPreference,
        zoom: zoomPreference
      },
      mapProps
    )

    const {
      latitude,
      longitude,
      projection: defaultProjection,
      zoom
    } = mapWithDefaults
    setCenter([latitude, longitude])
    setZoom(zoom)
    setProjection(defaultProjection)

    setMap(mapWithDefaults)
  }, [mapProps])

  const maxZoom = projection === projections.geographic ? 7 : 4

  let nonExcludedGranules
  if (focusedCollectionId && granuleSearchResults) {
    const { allIds, excludedGranuleIds, isOpenSearch } = granuleSearchResults
    const allGranuleIds = allIds

    let granuleIds
    if (isOpenSearch) {
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

  const handleProjectionSwitching = (projection) => {
    const { onChangeMap, onMetricsMap } = props

    const Projection = Object.keys(projections).find(((key) => (
      projections[key] === projection
    )))

    let latitude = 0
    const longitude = 0
    let zoom = 2

    if (projection === projections.arctic) {
      latitude = 90
      zoom = 0
    }

    if (projection === projections.antarctic) {
      latitude = -90
      zoom = 0
    }
    const map = {
      latitude,
      longitude,
      projection,
      zoom
    }
    setCenter([latitude, longitude])
    setZoom(zoom)
    setProjection(projection)

    onMetricsMap(`Set Projection: ${Projection}`)
    onChangeMap({ ...map })
  }

  // Projection switching in leaflet is not supported. Here we render MapWrapper with a key of the projection prop.
  // So when the projection is changed in ProjectionSwitcher this causes the map to unmount and remount a new instance,
  // which creates the illusion of 'changing' the projection
  return (
    <MapWrapper
      key={projection}
      authToken={authToken}
      base={base}
      center={center}
      collectionsMetadata={collectionsMetadata}
      drawingNewLayer={drawingNewLayer}
      focusedCollectionId={focusedCollectionId}
      focusedGranuleId={focusedGranuleId}
      granules={nonExcludedGranules}
      granulesMetadata={granulesMetadata}
      imageryCache={imageryCache.current}
      isProjectPage={isProjectPage}
      mapProps={mapProps}
      maxZoom={maxZoom}
      onChangeFocusedGranule={onChangeFocusedGranule}
      onChangeMap={onChangeMap}
      onChangeProjection={handleProjectionSwitching}
      onExcludeGranule={onExcludeGranule}
      onFetchShapefile={onFetchShapefile}
      onMetricsMap={onMetricsMap}
      onSaveShapefile={onSaveShapefile}
      onShapefileErrored={onShapefileErrored}
      onToggleTooManyPointsModal={onToggleTooManyPointsModal}
      onUpdateShapefile={onUpdateShapefile}
      overlays={overlays}
      project={project}
      projection={projection}
      shapefile={shapefile}
      zoom={zoom}
    />
  )
}

MapContainer.defaultProps = {
  map: {}
}

MapContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  collectionsMetadata: PropTypes.shape({}).isRequired,
  drawingNewLayer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  granuleSearchResults: PropTypes.shape({
    allIds: PropTypes.arrayOf(PropTypes.string),
    excludedGranuleIds: PropTypes.arrayOf(PropTypes.string),
    isOpenSearch: PropTypes.bool
  }).isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  map: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    projection: PropTypes.string,
    zoom: PropTypes.number,
    base: PropTypes.shape({
      blueMarble: PropTypes.bool,
      trueColor: PropTypes.bool,
      landWaterMap: PropTypes.bool
    }),
    overlays: PropTypes.shape({
      coastlines: PropTypes.bool,
      referenceFeatures: PropTypes.bool,
      referenceLabels: PropTypes.bool
    })
  }),
  mapPreferences: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    projection: PropTypes.string,
    zoom: PropTypes.number,
    baseLayer: PropTypes.string,
    overlayLayers: PropTypes.arrayOf(
      PropTypes.string
    )
  }).isRequired,
  onChangeFocusedGranule: PropTypes.func.isRequired,
  onChangeMap: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFetchShapefile: PropTypes.func.isRequired,
  onMetricsMap: PropTypes.func.isRequired,
  onSaveShapefile: PropTypes.func.isRequired,
  onShapefileErrored: PropTypes.func.isRequired,
  onToggleTooManyPointsModal: PropTypes.func.isRequired,
  onUpdateShapefile: PropTypes.func.isRequired,
  project: PropTypes.shape({}).isRequired,
  router: PropTypes.shape({
    location: locationPropType
  }).isRequired,
  shapefile: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
