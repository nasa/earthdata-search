import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useLayoutEffect
} from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { difference } from 'lodash-es'
import { Geometry } from 'ol/geom'

// @ts-expect-error The file does not have types
import actions from '../../actions'
// @ts-expect-error The file does not have types
import { metricsMap } from '../../middleware/metrics/actions'

import { eventEmitter } from '../../events/events'
// @ts-expect-error The file does not have types
import { getFocusedCollectionGranuleResults } from '../../selectors/collectionResults'
// @ts-expect-error The file does not have types
import { getColormapsMetadata } from '../../selectors/colormapsMetadata'
// @ts-expect-error The file does not have types
import { getGranulesMetadata } from '../../selectors/granuleMetadata'

import { isPath } from '../../util/isPath'
import { projectionConfigs } from '../../util/map/crs'
// @ts-expect-error The file does not have types
import murmurhash3 from '../../util/murmurhash3'
import hasGibsLayerForProjection from '../../util/hasGibsLayerForProjection'

// @ts-expect-error The file does not have types
import { getValueForTag } from '../../../../../sharedUtils/tags'

import projectionCodes from '../../constants/projectionCodes'

import Map from '../../components/Map/Map'
import { Colormap } from '../../components/Legend/Legend'

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

import spatialTypes from '../../constants/spatialTypes'

import { mapEventTypes } from '../../constants/eventTypes'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionsQuerySpatial } from '../../zustand/selectors/query'
import { getFocusedCollectionId } from '../../zustand/selectors/focusedCollection'
import { getFocusedGranuleId } from '../../zustand/selectors/focusedGranule'
import { getFocusedProjectCollection } from '../../zustand/selectors/project'

import type {
  CollectionsMetadata,
  GibsData,
  GranulesMetadata,
  MapGranule,
  ProjectionCode,
  SpatialSearch
} from '../../types/sharedTypes'

import type { ProjectCollection, ProjectGranules } from '../../zustand/types'

import './MapContainer.scss'

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onMetricsMap:
    (type: string) => dispatch(metricsMap(type)),
  onToggleDrawingNewLayer:
    (state: string | boolean) => dispatch(actions.toggleDrawingNewLayer(state)),
  onToggleShapefileUploadModal:
    (state: boolean) => dispatch(actions.toggleShapefileUploadModal(state)),
  onToggleTooManyPointsModal:
    (state: boolean) => dispatch(actions.toggleTooManyPointsModal(state))
})

// @ts-expect-error Don't want to define types for all of Redux
export const mapStateToProps = (state) => ({
  advancedSearch: state.advancedSearch,
  collectionsMetadata: state.metadata.collections,
  colormapsMetadata: getColormapsMetadata(state),
  displaySpatialPolygonWarning: state.ui.spatialPolygonWarning.isDisplayed,
  drawingNewLayer: state.ui.map.drawingNewLayer,
  granuleSearchResults: getFocusedCollectionGranuleResults(state),
  granulesMetadata: getGranulesMetadata(state),
  router: state.router
})

type ColormapMetadata = {
  /** The colormap metadata by GIBS product name */
  [key: string]: {
    /** The colormap data */
    colorMapData?: Colormap
    /** Is the colormap errored */
    isErrored?: boolean
    /** Is the colormap loading */
    isLoading?: boolean
    /** Is the colormap loaded */
    isLoaded?: boolean
  }
}

interface MapContainerProps {
  /** The advanced search object */
  advancedSearch: object
  /** The collections metadata */
  collectionsMetadata: CollectionsMetadata
  /** The colormaps metadata */
  colormapsMetadata: ColormapMetadata
  /** The display spatial polygon warning flag */
  displaySpatialPolygonWarning: boolean
  /** The drawing new layer flag */
  drawingNewLayer: string | boolean
  /** The granule search results */
  granuleSearchResults: {
    /** The IDs of the granule results */
    allIds: string[]
    /** The excluded granule IDs */
    excludedGranuleIds: string[]
    /** Are the granules Open Search */
    isOpenSearch: boolean
  }
  /** The granules metadata */
  granulesMetadata: GranulesMetadata
  /** Function to call the metrics map */
  onMetricsMap: (type: string) => void
  /** Function to toggle the drawing new layer */
  onToggleDrawingNewLayer: (state: string | boolean) => void
  /** Function to toggle the shapefile upload modal */
  onToggleShapefileUploadModal: (state: boolean) => void
  /** Function to toggle the too many points modal */
  onToggleTooManyPointsModal: (state: boolean) => void
  /** The router values */
  router: {
    /** The router location */
    location: {
      /** The pathname of the router */
      pathname: string
    }
  }
}

export const MapContainer: React.FC<MapContainerProps> = (props) => {
  const {
    advancedSearch = {},
    collectionsMetadata,
    colormapsMetadata,
    displaySpatialPolygonWarning,
    drawingNewLayer,
    granuleSearchResults,
    granulesMetadata,
    onMetricsMap,
    onToggleDrawingNewLayer,
    onToggleShapefileUploadModal,
    onToggleTooManyPointsModal,
    router
  } = props

  const { location } = router
  const { pathname } = location
  const isProjectPage = isPath(pathname, ['/projects'])
  const isFocusedCollectionPage = isPath(pathname, [
    '/search/granules',
    '/search/granules/collection-details'
  ])

  const spatialQuery = useEdscStore(getCollectionsQuerySpatial)
  const {
    boundingBox: boundingBoxSearch,
    circle: circleSearch,
    line: lineSearch,
    point: pointSearch,
    polygon: polygonSearch
  } = spatialQuery
  const {
    changeFocusedGranule,
    map: mapProps,
    onChangeMap,
    onChangeQuery,
    onClearShapefile,
    onExcludeGranule,
    onFetchShapefile,
    onUpdateShapefile,
    projectCollections,
    setStartDrawing,
    shapefile,
    showMbr,
    startDrawing
  } = useEdscStore((state) => ({
    changeFocusedGranule: state.focusedGranule.changeFocusedGranule,
    map: state.map.mapView,
    onChangeMap: state.map.setMapView,
    onChangeQuery: state.query.changeQuery,
    onClearShapefile: state.shapefile.clearShapefile,
    onExcludeGranule: state.query.excludeGranule,
    onFetchShapefile: state.shapefile.fetchShapefile,
    onUpdateShapefile: state.shapefile.updateShapefile,
    projectCollections: state.project.collections,
    setStartDrawing: state.home.setStartDrawing,
    shapefile: state.shapefile,
    showMbr: state.map.showMbr,
    startDrawing: state.home.startDrawing
  }))
  const focusedCollectionId = useEdscStore(getFocusedCollectionId)
  const focusedGranuleId = useEdscStore(getFocusedGranuleId)
  const focusedProjectCollection = useEdscStore(getFocusedProjectCollection)

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

  const [projection, setProjection] = useState<ProjectionCode>(propsProjection)
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

  const nonExcludedGranules: { [key: string]: { collectionId: string; index: number } } = {}
  // If the focusedGranuleId is set, add it to the nonExcludedGranules first.
  // This is so the focused granule is always drawn on top of the other granules
  if (focusedGranuleId && granulesMetadata[focusedGranuleId as string]) {
    nonExcludedGranules[focusedGranuleId] = {
      collectionId: focusedCollectionId!,
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
    const {
      allIds: projectIds,
      byId: projectById
    } = projectCollections

    projectIds.forEach((collectionId, index) => {
      const {
        granules: projectCollectionGranules,
        isVisible: projectCollectionIsVisible
      } = projectById[collectionId] || {}

      if (!projectCollectionGranules || !projectCollectionIsVisible) return

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

  const handleProjectionSwitching = useCallback((newProjectionCode: ProjectionCode) => {
    const {
      onMetricsMap: callbackOnMetricsMap
    } = props

    const Projection = Object.keys(projectionCodes).find(((key) => (
      projectionCodes[key as keyof typeof projectionCodes] === newProjectionCode
    )))

    const projectionConfig = projectionConfigs[newProjectionCode as keyof typeof projectionConfigs]
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
    onChangeMap({ ...newMap })
  }, [projection])

  const handleDrawEnd = useCallback((geometry: Geometry | undefined) => {
    if (startDrawing) {
      eventEmitter.emit(mapEventTypes.MOVEMAP, { source: geometry })
    }

    setStartDrawing(false)
  }, [setStartDrawing])

  // Get the metadata for the currently focused collection, or an empty object if no collection is focused
  const focusedCollectionMetadata = useMemo(
    () => collectionsMetadata[focusedCollectionId!] || {},
    [focusedCollectionId, collectionsMetadata]
  )

  const { tags } = focusedCollectionMetadata
  const [gibsTag] = getValueForTag('gibs', tags) || []

  // Get the colormap data for the currently focused collection
  const colorMapState: ColormapMetadata = useMemo(() => {
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
  let gibsData: Partial<GibsData> = {}
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
  const allAddedGranuleIds: string[] = []
  const allRemovedGranuleIds: string[] = []

  // If on the focusedCollectionPage and the focusedCollectionId is set, get the added and removed granule ids
  if (isFocusedCollectionPage && focusedCollectionId && focusedCollectionId !== '') {
    const { granules = {} } = focusedProjectCollection as ProjectCollection
    const { addedGranuleIds = [], removedGranuleIds = [] } = granules as ProjectGranules

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
  const granulesToDraw: MapGranule[] = []
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

      let granuleGibsData: Partial<GibsData> | undefined

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
        gibsData: granuleGibsData as GibsData,
        granuleId,
        granuleStyle: granule.granuleStyle,
        highlightedStyle: granule.highlightedStyle,
        spatial: granule.spatial
      })
    })
  }

  // Create the spatial search object to pass to the map
  const spatialSearch = useMemo<SpatialSearch>(() => ({
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
      changeFocusedGranule={changeFocusedGranule}
      colorMap={colorMap as Colormap}
      focusedCollectionId={focusedCollectionId!}
      focusedGranuleId={focusedGranuleId}
      granules={granulesToDraw}
      granulesKey={granulesKey}
      isFocusedCollectionPage={isFocusedCollectionPage}
      isProjectPage={isProjectPage}
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

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
