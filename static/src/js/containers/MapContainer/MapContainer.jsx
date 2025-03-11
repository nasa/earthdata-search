/* eslint-disable */
// TODO I'm just disabling eslint here because I want to leave the existing code in place as reference

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo
} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  difference,
  isEqual,
  merge
} from 'lodash-es'
import 'proj4leaflet'
import LRUCache from 'lrucache'

import actions from '../../actions'
import { metricsMap } from '../../middleware/metrics/actions'

import { getFocusedCollectionGranuleResults } from '../../selectors/collectionResults'
import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getColormapsMetadata } from '../../selectors/colormapsMetadata'
import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getGranulesMetadata } from '../../selectors/granuleMetadata'
import { getMapPreferences } from '../../selectors/preferences'
import { isPath } from '../../util/isPath'
import { locationPropType } from '../../util/propTypes/location'
import projections from '../../util/map/projections'
import { projectionConfigs } from '../../util/map/crs'
import murmurhash3 from '../../util/murmurhash3'
import hasGibsLayerForProjection from '../../util/hasGibsLayerForProjection'
import { getValueForTag } from '../../../../../sharedUtils/tags'
// import '../../util/map/sphericalPolygon'

// import 'leaflet/dist/leaflet.css'
import './MapContainer.scss'

// import MapWrapper from './MapWrapper'
import Map from '../../components/Map/Map'

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
  colormapsMetadata: getColormapsMetadata(state),
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
    colormapsMetadata,
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
  const isFocusedCollectionPage = isPath(pathname, [
    '/search/granules',
    '/search/granules/collection-details'
  ])
  // TODO EDSC-4418 need to be sure URL values override preferences (broken in prod)
  const [map, setMap] = useState(mapProps)
  const imageryCache = useRef(LRUCache(400))

  const {
    base,
    latitude,
    longitude,
    overlays,
    projection: propsProjection,
    rotation,
    zoom: zoomProps
  } = map

  const [projection, setProjection] = useState(propsProjection)
  const [center, setCenter] = useState({
    latitude,
    longitude
  })
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
      latitude: defaultLatitude,
      longitude: defaultLongitude,
      projection: defaultProjection,
      zoom: defaultZoom
    } = mapWithDefaults

    if (isEqual(map, mapWithDefaults)) return

    setCenter({
      latitude: defaultLatitude,
      longitude: defaultLongitude
    })

    setZoom(defaultZoom)
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

  const handleProjectionSwitching = useCallback((newProjectionCode) => {
    const {
      onChangeMap: callbackOnChangeMap,
      onMetricsMap: callbackOnMetricsMap
    } = props

    const Projection = Object.keys(projections).find(((key) => (
      projections[key] === newProjectionCode
    )))

    const projectionConfig = projectionConfigs[newProjectionCode]
    const [newLongitude, newLatitude] = projectionConfig.center
    const newZoom = projectionConfig.zoom

    const newMap = {
      latitude: newLatitude,
      longitude: newLongitude,
      projection: newProjectionCode,
      zoom: newZoom
    }

    setCenter({
      latitude: newLatitude,
      longitude: newLongitude
    })

    setZoom(newZoom)
    setProjection(newProjectionCode)

    callbackOnMetricsMap(`Set Projection: ${Projection}`)
    callbackOnChangeMap({ ...newMap })
  }, [projection])

  const focusedCollectionMetadata = useMemo(() => collectionsMetadata[focusedCollectionId] || {}, [focusedCollectionId, collectionsMetadata])

  const colorMapState = useMemo(() => {
    const { tags } = focusedCollectionMetadata
    const [gibsTag] = getValueForTag('gibs', tags) || []
    let colorMapData = {}

    if (gibsTag && hasGibsLayerForProjection(gibsTag, projection)) {
      const { product } = gibsTag
      colorMapData = colormapsMetadata[product] || {}
    }

    return colorMapData
  }, [focusedCollectionMetadata, colormapsMetadata, projection])

 
  const { colorMapData: colorMap = {} } = colorMapState

  // Projection switching in leaflet is not supported. Here we render MapWrapper with a key of the projection prop.
  // So when the projection is changed in ProjectionSwitcher this causes the map to unmount and remount a new instance,
  // which creates the illusion of 'changing' the projection
  // return (
  //   <MapWrapper
  //     key={projection}
  //     authToken={authToken}
  //     base={base}
  //     center={center}
  //     collectionsMetadata={collectionsMetadata}
  //     colormapsMetadata={colormapsMetadata}
  //     drawingNewLayer={drawingNewLayer}
  //     focusedCollectionId={focusedCollectionId}
  //     focusedGranuleId={focusedGranuleId}
  //     granules={nonExcludedGranules}
  //     granulesMetadata={granulesMetadata}
  //     imageryCache={imageryCache.current}
  //     isFocusedCollectionPage={isFocusedCollectionPage}
  //     isProjectPage={isProjectPage}
  //     mapProps={mapProps}
  //     maxZoom={maxZoom}
  //     onChangeFocusedGranule={onChangeFocusedGranule}
  //     onChangeMap={onChangeMap}
  //     onChangeProjection={handleProjectionSwitching}
  //     onExcludeGranule={onExcludeGranule}
  //     onFetchShapefile={onFetchShapefile}
  //     onMetricsMap={onMetricsMap}
  //     onSaveShapefile={onSaveShapefile}
  //     onShapefileErrored={onShapefileErrored}
  //     onToggleTooManyPointsModal={onToggleTooManyPointsModal}
  //     onUpdateShapefile={onUpdateShapefile}
  //     overlays={overlays}
  //     project={project}
  //     projection={projection}
  //     shapefile={shapefile}
  //     zoom={zoom}
  //   />
  // )

  // const [leftPadding, setLeftPadding] = useState(500)

  // useEffect(() => {
  //   // TODO come up with this value based on panel width
  //   setLeftPadding(leftPadding + 100)
  // }, [zoom])

  return (
    <Map
      center={center}
      projectionCode={projection}
      rotation={rotation}
      zoom={zoom}
      onChangeMap={onChangeMap}
      onChangeProjection={handleProjectionSwitching}
      colorMap={colorMap}
      isFocusedCollectionPage={isFocusedCollectionPage}
    />
  )
}

MapContainer.defaultProps = {
  map: {}
}

MapContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  collectionsMetadata: PropTypes.shape({}).isRequired,
  colormapsMetadata: PropTypes.shape({}).isRequired,
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
