import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
  useLayoutEffect
} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { difference } from 'lodash-es'

import actions from '../../actions'
import { metricsMap } from '../../middleware/metrics/actions'

import { eventEmitter } from '../../events/events'
import { getFocusedCollectionGranuleResults } from '../../selectors/collectionResults'
import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getColormapsMetadata } from '../../selectors/colormapsMetadata'
import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getGranulesMetadata } from '../../selectors/granuleMetadata'
import { getMapPreferences } from '../../selectors/preferences'
import { isPath } from '../../util/isPath'
import { locationPropType } from '../../util/propTypes/location'
import projectionCodes from '../../constants/projectionCodes'
import { projectionConfigs } from '../../util/map/crs'
import murmurhash3 from '../../util/murmurhash3'
import hasGibsLayerForProjection from '../../util/hasGibsLayerForProjection'
import { getValueForTag } from '../../../../../sharedUtils/tags'

import Map from '../../components/Map/Map'
import {
  backgroundGranulePointStyle,
  backgroundGranuleStyle,
  deemphisizedGranuleStyle,
  deemphisizedGranulePointStyle,
  granuleStyle,
  highlightedGranuleStyle,
  highlightedGranulePointStyle,
  granulePointStyle
} from '../../util/map/styles'

import './MapContainer.scss'
import spatialTypes from '../../constants/spatialTypes'
import MbrContext from '../../contexts/MbrContext'

import HomeContext from '../../contexts/HomeContext'
import { mapEventTypes } from '../../constants/eventTypes'

export const mapDispatchToProps = (dispatch) => ({
  onChangeFocusedGranule:
    (granuleId) => dispatch(actions.changeFocusedGranule(granuleId)),
  onChangeMap:
    (query) => dispatch(actions.changeMap(query)),
  onChangeQuery: (query) => dispatch(actions.changeQuery(query)),
  onClearShapefile: (query) => dispatch(actions.clearShapefile(query)),
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
  onToggleDrawingNewLayer: (state) => dispatch(actions.toggleDrawingNewLayer(state)),
  onToggleShapefileUploadModal: (state) => dispatch(actions.toggleShapefileUploadModal(state)),
  onToggleTooManyPointsModal:
    (state) => dispatch(actions.toggleTooManyPointsModal(state)),
  onUpdateShapefile:
    (data) => dispatch(actions.updateShapefile(data))
})

export const mapStateToProps = (state) => ({
  advancedSearch: state.advancedSearch,
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  circleSearch: state.query.collection.spatial.circle,
  collectionsMetadata: state.metadata.collections,
  colormapsMetadata: getColormapsMetadata(state),
  displaySpatialPolygonWarning: state.ui.spatialPolygonWarning.isDisplayed,
  drawingNewLayer: state.ui.map.drawingNewLayer,
  focusedCollectionId: getFocusedCollectionId(state),
  focusedGranuleId: getFocusedGranuleId(state),
  granuleSearchResults: getFocusedCollectionGranuleResults(state),
  granulesMetadata: getGranulesMetadata(state),
  lineSearch: state.query.collection.spatial.line,
  map: state.map,
  mapPreferences: getMapPreferences(state),
  pointSearch: state.query.collection.spatial.point,
  polygonSearch: state.query.collection.spatial.polygon,
  project: state.project,
  router: state.router,
  shapefile: state.shapefile
})

export const MapContainer = (props) => {
  const {
    advancedSearch,
    boundingBoxSearch,
    circleSearch,
    collectionsMetadata,
    colormapsMetadata,
    displaySpatialPolygonWarning,
    drawingNewLayer,
    focusedCollectionId,
    focusedGranuleId,
    granuleSearchResults,
    granulesMetadata,
    lineSearch,
    map: mapProps,
    onChangeFocusedGranule,
    onChangeMap,
    onChangeQuery,
    onClearShapefile,
    onExcludeGranule,
    onFetchShapefile,
    onMetricsMap,
    onToggleDrawingNewLayer,
    onToggleShapefileUploadModal,
    onToggleTooManyPointsModal,
    onUpdateShapefile,
    pointSearch,
    polygonSearch,
    project,
    router,
    shapefile
  } = props

  const { showMbr } = useContext(MbrContext)

  const { location } = router
  const { pathname } = location
  const isProjectPage = isPath(pathname, '/projects')
  const isFocusedCollectionPage = isPath(pathname, [
    '/search/granules',
    '/search/granules/collection-details'
  ])

  const { startDrawing, setStartDrawing } = useContext(HomeContext)

  const [mapReady, setMapReady] = useState(false)

  useLayoutEffect(() => {
    if (startDrawing && mapReady) {
      if (startDrawing === 'file') {
        onToggleShapefileUploadModal(true)
      } else {
        eventEmitter.emit(mapEventTypes.DRAWSTART, startDrawing)
      }
    }
  }, [startDrawing, mapReady])

  const {
    base,
    latitude,
    longitude,
    overlays,
    projection: propsProjection,
    rotation,
    zoom: zoomProps
  } = mapProps

  const [projection, setProjection] = useState(propsProjection)
  const [center, setCenter] = useState({
    latitude,
    longitude
  })
  const [zoom, setZoom] = useState(zoomProps)

  // If there is a shapefileId in the store but we haven't fetched the shapefile yet, fetch it
  useEffect(() => {
    if (shapefile) {
      const {
        isLoaded,
        isLoading,
        shapefileId
      } = shapefile

      if (shapefileId && !isLoaded && !isLoading) onFetchShapefile(shapefileId)
    }
  }, [shapefile])

  const nonExcludedGranules = {}
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

    const Projection = Object.keys(projectionCodes).find(((key) => (
      projectionCodes[key] === newProjectionCode
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

  const handleDrawEnd = useCallback((geometry) => {
    if (startDrawing) {
      eventEmitter.emit(mapEventTypes.MOVEMAP, { source: geometry })
    }

    setStartDrawing(false)
  }, [setStartDrawing])

  // Get the metadata for the currently focused collection, or an empty object if no collection is focused
  const focusedCollectionMetadata = useMemo(
    () => collectionsMetadata[focusedCollectionId] || {},
    [focusedCollectionId, collectionsMetadata]
  )

  const { tags } = focusedCollectionMetadata
  const [gibsTag] = getValueForTag('gibs', tags) || []

  // Get the colormap data for the currently focused collection
  const colorMapState = useMemo(() => {
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
    if (projection === projectionCodes.antarctic) {
      resolution = antarcticResolution
    } else if (projection === projectionCodes.arctic) {
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

  // Added and removed granule ids for the focused collection are used to apply different
  // styles to the granules. Granules that are added are drawn with a regular style, while
  // granules that are removed are drawn with a deemphasized style.
  const allAddedGranuleIds = []
  const allRemovedGranuleIds = []

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
      const granule = { ...granulesMetadata[granuleId] }

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

      // If the granule does not have spatial, don't draw it
      if (!spatial) return

      const { geometry = {} } = spatial
      const { type } = geometry

      if (type === spatialTypes.POINT) {
        granule.backgroundGranuleStyle = backgroundGranulePointStyle
        granule.highlightedStyle = highlightedGranulePointStyle(index)
        granule.granuleStyle = shouldDrawRegularStyle
          ? granulePointStyle(index)
          : deemphisizedGranulePointStyle(index)
      } else {
        granule.backgroundGranuleStyle = backgroundGranuleStyle
        granule.highlightedStyle = highlightedGranuleStyle(index)
        granule.granuleStyle = shouldDrawRegularStyle
          ? granuleStyle(index)
          : deemphisizedGranuleStyle(index)
      }

      let granuleGibsData

      if (gibsTag) {
        const gibsTime = gibsData.layerPeriod?.toLowerCase() === 'subdaily' ? timeStart : timeStart.substring(0, 10)

        granuleGibsData = {
          ...gibsData,
          opacity: shouldDrawRegularStyle ? 1 : 0.5,
          time: gibsTime,
          url: `https://gibs-{a-c}.earthdata.nasa.gov/wmts/${projection}/best/wmts.cgi?TIME=${gibsTime}`
        }
      }

      granulesToDraw.push({
        backgroundGranuleStyle: granule.backgroundGranuleStyle,
        collectionId,
        formattedTemporal,
        gibsData: granuleGibsData,
        granuleId,
        granuleStyle: granule.granuleStyle,
        highlightedStyle: granule.highlightedStyle,
        spatial: granule.spatial
      })
    })
  }

  // Create the spatial search object to pass to the map
  const spatialSearch = useMemo(() => ({
    advancedSearch,
    boundingBoxSearch,
    circleSearch,
    drawingNewLayer,
    lineSearch,
    pointSearch,
    polygonSearch,
    showMbr: showMbr || displaySpatialPolygonWarning
  }), [
    advancedSearch,
    boundingBoxSearch,
    circleSearch,
    displaySpatialPolygonWarning,
    drawingNewLayer,
    lineSearch,
    pointSearch,
    polygonSearch,
    projection,
    showMbr
  ])

  const memoizedShapefile = useMemo(() => shapefile, [shapefile])

  return (
    <Map
      base={base}
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
      onChangeQuery={onChangeQuery}
      onClearShapefile={onClearShapefile}
      onDrawEnd={handleDrawEnd}
      onExcludeGranule={onExcludeGranule}
      onMetricsMap={onMetricsMap}
      onToggleDrawingNewLayer={onToggleDrawingNewLayer}
      onToggleShapefileUploadModal={onToggleShapefileUploadModal}
      onToggleTooManyPointsModal={onToggleTooManyPointsModal}
      onUpdateShapefile={onUpdateShapefile}
      overlays={overlays}
      projectionCode={projection}
      rotation={rotation}
      shapefile={memoizedShapefile}
      spatialSearch={spatialSearch}
      zoom={zoom}
      onMapReady={setMapReady}
    />
  )
}

MapContainer.defaultProps = {
  map: {},
  advancedSearch: {},
  boundingBoxSearch: undefined,
  circleSearch: undefined,
  lineSearch: undefined,
  pointSearch: undefined,
  polygonSearch: undefined
}

MapContainer.propTypes = {
  advancedSearch: PropTypes.shape({}),
  boundingBoxSearch: PropTypes.arrayOf(PropTypes.string),
  circleSearch: PropTypes.arrayOf(PropTypes.string),
  collectionsMetadata: PropTypes.shape({}).isRequired,
  colormapsMetadata: PropTypes.shape({}).isRequired,
  displaySpatialPolygonWarning: PropTypes.bool.isRequired,
  drawingNewLayer: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  granuleSearchResults: PropTypes.shape({
    allIds: PropTypes.arrayOf(PropTypes.string),
    excludedGranuleIds: PropTypes.arrayOf(PropTypes.string),
    isOpenSearch: PropTypes.bool
  }).isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  lineSearch: PropTypes.arrayOf(PropTypes.string),
  map: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    projection: PropTypes.string,
    zoom: PropTypes.number,
    base: PropTypes.shape({
      worldImagery: PropTypes.bool,
      trueColor: PropTypes.bool,
      landWaterMap: PropTypes.bool
    }),
    overlays: PropTypes.shape({
      coastlines: PropTypes.bool,
      bordersRoads: PropTypes.bool,
      placeLabels: PropTypes.bool
    }),
    rotation: PropTypes.number
  }),
  mapPreferences: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    projection: PropTypes.string,
    zoom: PropTypes.number,
    baseLayer: PropTypes.string,
    overlayLayers: PropTypes.arrayOf(PropTypes.string),
    rotation: PropTypes.number
  }).isRequired,
  onChangeFocusedGranule: PropTypes.func.isRequired,
  onChangeMap: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onClearShapefile: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFetchShapefile: PropTypes.func.isRequired,
  onMetricsMap: PropTypes.func.isRequired,
  onSaveShapefile: PropTypes.func.isRequired,
  onShapefileErrored: PropTypes.func.isRequired,
  onToggleDrawingNewLayer: PropTypes.func.isRequired,
  onToggleShapefileUploadModal: PropTypes.func.isRequired,
  onToggleTooManyPointsModal: PropTypes.func.isRequired,
  onUpdateShapefile: PropTypes.func.isRequired,
  pointSearch: PropTypes.arrayOf(PropTypes.string),
  polygonSearch: PropTypes.arrayOf(PropTypes.string),
  project: PropTypes.shape({
    collections: PropTypes.shape({
      allIds: PropTypes.arrayOf(PropTypes.string),
      byId: PropTypes.shape({})
    })
  }).isRequired,
  router: PropTypes.shape({
    location: locationPropType
  }).isRequired,
  shapefile: PropTypes.shape({
    isLoaded: PropTypes.bool,
    isLoading: PropTypes.bool,
    shapefileId: PropTypes.string
  }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
