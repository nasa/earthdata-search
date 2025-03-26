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
// import 'proj4leaflet'
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

import Map from '../../components/Map/Map'
import {
  backgroundPointStyle,
  backgroundStyle,
  deemphisizedGranuleStyle,
  deemphisizedPointStyle,
  granuleStyle,
  highlightedGranuleStyle,
  highlightedPointStyle,
  pointStyle
} from '../../util/map/styles'

import './MapContainer.scss'

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

  let nonExcludedGranules = {}
  // If the focusedGranuleId is set, add it to the nonExcludedGranules first.
  // This is so the focused granule is always drawn on top of the other granules
  if (focusedGranuleId && granulesMetadata[focusedGranuleId]) {
    nonExcludedGranules[focusedGranuleId] = {
      collectionId: focusedCollectionId,
      index: 0
    }
  }

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

    granuleIds.forEach((granuleId) => {
      nonExcludedGranules[granuleId] = {
        collectionId: focusedCollectionId,
        index: 0
      }
    })
  }

  // If on the project page, get the granules from the projectCollections
  if (isProjectPage) {
    const { collections: projectCollections } = project
    const {
      allIds: projectIds,
      byId: projectById
    } = projectCollections

    projectIds.forEach((collectionId, index) => {
      const {
        granules: projectCollectionGranules
      } = projectById[collectionId]

      if (!projectCollectionGranules) return

      const { allIds = [] } = projectCollectionGranules

      allIds.forEach((granuleId) => {
        if (granulesMetadata[granuleId]) {
          nonExcludedGranules[granuleId] = {
            collectionId,
            index
          }
        }
      })
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

  // Get the metadata for the currently focused collection, or an empty object if no collection is focused
  const focusedCollectionMetadata = useMemo(() => collectionsMetadata[focusedCollectionId] || {}, [focusedCollectionId, collectionsMetadata])

  // Get the colormap data for the currently focused collection
  const colorMapState = useMemo(() => {
    const { tags } = focusedCollectionMetadata
    const [gibsTag] = getValueForTag('gibs', tags) || []
    let colorMapData = {}

    // If the collection has a GIBS tag and the GIBS layer is available for the current projection, use the colormap data
    if (gibsTag && hasGibsLayerForProjection(gibsTag, projection)) {
      const { product } = gibsTag
      colorMapData = colormapsMetadata[product] || {}
    }

    return colorMapData
  }, [gibsTag, colormapsMetadata, projection])


  const { colorMapData: colorMap = {} } = colorMapState
  // Get GIBS data to pass to the map within each granule
  let gibsData = {}
  if (gibsTag) {
    const {
      antarctic_resolution: antarcticResolution,
      arctic_resolution: arcticResolution,
      format,
      geographic_resolution: geographicResolution,
      layerPeriod,
      product
    } = gibsTag

    let resolution
    if (projection === projections.antarctic) {
      resolution = antarcticResolution
    } else if (projection === projections.arctic) {
      resolution = arcticResolution
    } else {
      resolution = geographicResolution
    }

    gibsData = {
      format,
      layerPeriod,
      product,
      resolution
    }
  }

>>>>>>> EDSC-4410
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


  // Added and removed granule ids for the focused collection are used to apply different
  // styles to the granules. Granules that are added are drawn with a regular style, while
  // granules that are removed are drawn with a deemphasized style.
  let allAddedGranuleIds = []
  let allRemovedGranuleIds = []

  // If the focusedCollectionId is set, get the added and removed granule ids
  if (focusedCollectionId && focusedCollectionId !== '') {
    const { collections } = project
    const { byId: projectById } = collections
    const { [focusedCollectionId]: focusedProjectCollection = {} } = projectById

    const { granules = {} } = focusedProjectCollection
    const { addedGranuleIds = [], removedGranuleIds = [] } = granules

    allAddedGranuleIds.push(...addedGranuleIds)
    allRemovedGranuleIds.push(...removedGranuleIds)
  }

  // Generate a key based on the nonExcludedGranules and the addedGranuleIds and removedGranuleIds
  // This key will be used to determine if the granules need to be redrawn
  const granulesKey = Buffer.from(JSON.stringify({
    nonExcludedGranuleIds: Object.keys(nonExcludedGranules),
    addedGranuleIds: allAddedGranuleIds,
    removedGranuleIds: allRemovedGranuleIds
  })).toString('base64')

  // Generate the granulesToDraw based on the nonExcludedGranules and the addedGranuleIds and removedGranuleIds
  const granulesToDraw = []
  const granuleIds = Object.keys(nonExcludedGranules)
  if (granuleIds.length > 0) {
    granuleIds.forEach((granuleId) => {
      const { collectionId, index } = nonExcludedGranules[granuleId]
      const granule = granulesMetadata[granuleId]

      // Determine if the granule should be drawn with the regular style or the deemphasized style
      let shouldDrawRegularStyle = true

      if (allAddedGranuleIds.length > 0) {
        shouldDrawRegularStyle = allAddedGranuleIds.includes(granuleId)
      }

      if (allRemovedGranuleIds.length > 0) {
        shouldDrawRegularStyle = !allRemovedGranuleIds.includes(granuleId)
      }

      const {
        formattedTemporal,
        spatial = {},
        timeStart
      } = granule
      const { geometry = {} } = spatial
      const { type } = geometry

      if (type === 'Point') {
        granule.backgroundStyle = backgroundPointStyle
        granule.granuleStyle = shouldDrawRegularStyle ? pointStyle(index) : deemphisizedPointStyle(index)
        granule.highlightedStyle = highlightedPointStyle(index)
      } else {
        granule.backgroundStyle = backgroundStyle
        granule.granuleStyle = shouldDrawRegularStyle ? granuleStyle(index) : deemphisizedGranuleStyle(index)
        granule.highlightedStyle = highlightedGranuleStyle(index)
      }

      const gibsTime = gibsData.layerPeriod?.toLowerCase() === 'subdaily' ? timeStart : timeStart.substring(0, 10)
      granulesToDraw.push({
        backgroundStyle: granule.backgroundStyle,
        collectionId,
        formattedTemporal,
        gibsData: {
          ...gibsData,
          opacity: shouldDrawRegularStyle ? 1 : 0.5,
          time: gibsTime,
          url: `https://gibs-{a-c}.earthdata.nasa.gov/wmts/${projection}/best/wmts.cgi?TIME=${gibsTime}`
        },
        granuleId,
        granuleStyle: granule.granuleStyle,
        highlightedStyle: granule.highlightedStyle,
        spatial: granule.spatial
      })
    })
  }

  return (
    <Map
      center={center}
      colorMap={colorMap}
      focusedCollectionId={focusedCollectionId}
      focusedGranuleId={focusedGranuleId}
      granules={granulesToDraw}
      granulesKey={granulesKey}
      isFocusedCollectionPage={isFocusedCollectionPage}
      isProjectPage={isProjectPage}
      onChangeFocusedGranule={onChangeFocusedGranule}
      onChangeMap={onChangeMap}
      onChangeProjection={handleProjectionSwitching}
      onExcludeGranule={onExcludeGranule}
      projectionCode={projection}
      rotation={rotation}
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
