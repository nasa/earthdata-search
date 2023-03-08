/* eslint-disable no-underscore-dangle */
import L from 'leaflet'
import {
  difference,
  isEqual
} from 'lodash'

import { createLayerComponent } from '@react-leaflet/core'

import { getColorByIndex } from '../../util/colors'

import { GranuleGridLayerExtended } from './GranuleGridLayerExtended'

import './GranuleGridLayer.scss'

const layerBuffer = 20

/**
 * Get the data needed to create a new GranuleGridLayerExtended layer
 * @param {object} props
 * @returns {array} Array of layer data objects
 */
const getLayerData = (props) => {
  const {
    collectionsMetadata,
    focusedCollectionId,
    granules,
    granulesMetadata,
    isProjectPage,
    project
  } = props

  const layers = {}

  if (isProjectPage) {
    // If we are on the project page, return data for each project collection
    const { collections: projectCollections } = project
    const {
      allIds: projectIds,
      byId: projectById
    } = projectCollections

    projectIds.forEach((collectionId, index) => {
      const { granules, isVisible } = projectById[collectionId]
      const { [collectionId]: metadata = {} } = collectionsMetadata

      if (!granules) return
      granules.byId = {}

      const { allIds = [] } = granules
      allIds.forEach((granuleId) => {
        if (granulesMetadata[granuleId]) {
          granules.byId[granuleId] = granulesMetadata[granuleId]
        }
      })

      layers[collectionId] = {
        collectionId,
        color: getColorByIndex(index),
        lightColor: getColorByIndex(index, true),
        metadata,
        isVisible,
        granules
      }
    })
  } else if (focusedCollectionId && focusedCollectionId !== '') {
    // If we aren't on the project page, return data for focusedCollectionId if it exists
    const { [focusedCollectionId]: focusedCollectionIdMetadata = {} } = collectionsMetadata

    layers[focusedCollectionId] = {
      collectionId: focusedCollectionId,
      color: getColorByIndex(0),
      lightColor: getColorByIndex(0, true),
      isVisible: true,
      metadata: focusedCollectionIdMetadata,
      granules
    }
  }

  return layers
}

const createGranuleGridLayer = (props, context) => {
  const layers = []

  const {
    drawingNewLayer,
    focusedCollectionId,
    focusedGranuleId,
    projection,
    project,
    onChangeFocusedGranule,
    onExcludeGranule,
    onMetricsMap,
    imageryCache,
    isProjectPage
  } = props

  // Create a GranuleGridLayerExtended layer from each data object in getLayerData
  const layerData = getLayerData(props)

  Object.keys(layerData).forEach((id) => {
    const {
      collectionId,
      color,
      metadata,
      granules = {}
    } = layerData[id]

    const { byId = {} } = granules
    const granuleData = Object.values(byId)

    const layer = new GranuleGridLayerExtended({
      collectionId,
      color,
      drawingNewLayer,
      focusedCollectionId,
      focusedGranuleId,
      granules: granuleData,
      imageryCache,
      isProjectPage,
      metadata,
      onChangeFocusedGranule,
      onExcludeGranule,
      onMetricsMap,
      project,
      projection
    })

    // Set the ZIndex for the layer
    if (focusedCollectionId === collectionId) {
      layer.setZIndex(2)
    } else {
      layer.setZIndex(1)
    }

    layers.push(layer)
  })

  // Save the list of layers and create a feature group for the layers
  const featureGroup = new L.FeatureGroup(layers)
  return { instance: featureGroup, context }
}

const updateGranuleGridLayer = (instance, props, prevProps) => {
  const layers = instance._layers // List of layers

  const {
    drawingNewLayer,
    focusedCollectionId,
    focusedGranuleId,
    projection,
    project,
    imageryCache,
    isProjectPage,
    onChangeFocusedGranule,
    onExcludeGranule,
    onMetricsMap
  } = props

  const {
    drawingNewLayer: prevDrawingNewLayer,
    focusedGranuleId: prevFocusedGranule,
    focusedCollectionId: prevFocusedCollection,
    isProjectPage: prevIsProjectPage
  } = prevProps

  const prevLayerData = getLayerData(prevProps)
  const layerData = getLayerData(props)

  const layerDataCollectionIds = Object.keys(layerData)

  // Nothing should be drawn, remove any existing layers
  if (layerDataCollectionIds.length === 0) {
    Object.values(layers).forEach((layer) => {
      if (layer._granuleFocusLayer) layer._granuleFocusLayer.onRemove(instance._map)
      if (layer._granuleStickyLayer) layer._granuleStickyLayer.onRemove(instance._map)
      instance.removeLayer(layer)
    })
  } else if (layerDataCollectionIds.length < Object.keys(prevLayerData).length) {
    // If there is less data than before, figure out which collection was removed and remove the layer

    const prevIds = Object.keys(prevLayerData)
    const diffIds = difference(prevIds, layerDataCollectionIds)

    diffIds.forEach((collectionId) => {
      Object.values(layers).forEach((layer) => {
        if (layer.collectionId === collectionId) {
          instance.removeLayer(layer)
        }
      })
    })
  }

  // Loop through each layer data object to update the layer
  layerDataCollectionIds.forEach((id) => {
    const {
      collectionId,
      color,
      lightColor,
      metadata,
      isVisible,
      granules = {}
    } = layerData[id]

    // Find the layer for this collection
    const layer = Object.values(layers).find((l) => l.collectionId === collectionId)

    const { project: prevPropsProject } = prevProps
    const { collections: prevPropsProjectCollections = {} } = prevPropsProject
    const { byId: prevPropsProjectCollectionsById = {} } = prevPropsProjectCollections
    const { [collectionId]: prevProjectCollection = {} } = prevPropsProjectCollectionsById
    const { granules: prevProjectGranules = {} } = prevProjectCollection

    const { collections: projectCollections = {} } = project
    const { byId: projectCollectionsById = {} } = projectCollections
    const { [collectionId]: projectCollection = {} } = projectCollectionsById
    const { granules: newGranules = {} } = projectCollection

    let prevAddedGranuleIds
    let prevRemovedGranuleIds
    let addedGranuleIds
    let removedGranuleIds

    if (prevProjectGranules) {
      ({
        addedGranuleIds: prevAddedGranuleIds,
        removedGranuleIds: prevRemovedGranuleIds
      } = prevProjectGranules)
    }

    if (newGranules) {
      ({
        addedGranuleIds,
        removedGranuleIds
      } = newGranules)
    }

    // If no granules were changed, bail out
    const { byId: granulesById = {} } = granules
    const prevCollection = prevLayerData[collectionId]
    const { granules: prevGranules = {} } = prevCollection || {}
    const { byId: prevGranulesById = {} } = prevGranules

    if (
      prevCollection
      && prevIsProjectPage !== isProjectPage
      && prevFocusedCollection !== focusedCollectionId
      && prevFocusedGranule !== focusedGranuleId
      && isEqual(Object.keys(granulesById), Object.keys(prevGranulesById))
      && isEqual(addedGranuleIds, prevAddedGranuleIds)
      && isEqual(removedGranuleIds, prevRemovedGranuleIds)
    ) {
      // If no granules were changed, but drawingNewLayer was changed, update the layer
      if (prevDrawingNewLayer !== drawingNewLayer) {
        layer.setDrawingNewLayer(drawingNewLayer)
      }

      return
    }

    // If the collecton is not visible, set the granuleData to an empty array
    const granuleData = isVisible ? Object.values(granulesById) : []

    if (layer) {
      const {
        isVisible: prevIsVisible
      } = prevCollection

      // If the granules and the visibility haven't changed, bail out
      if (
        prevGranules === granules
        && prevIsVisible === isVisible
        && prevFocusedCollection === focusedCollectionId
        && isEqual(addedGranuleIds, prevAddedGranuleIds)
        && isEqual(removedGranuleIds, prevRemovedGranuleIds)
      ) return

      // Update the layer with the new granuleData
      layer.setResults({
        addedGranuleIds,
        collectionId,
        color,
        drawingNewLayer,
        defaultGranules: granuleData,
        focusedCollectionId,
        focusedGranuleId,
        granules: granuleData,
        isProjectPage,
        lightColor,
        metadata,
        projectCollection,
        projection,
        removedGranuleIds
      })

      if (focusedCollectionId === collectionId) {
        layer.setZIndex(layerBuffer + 2)
      } else {
        layer.setZIndex(layerBuffer + 1)
      }
    } else {
      // A layer doesn't exist for this collection yet, maybe we just added a focusedCollectionId, so create a new layer
      const layer = new GranuleGridLayerExtended({
        addedGranuleIds,
        collectionId,
        color,
        drawingNewLayer,
        focusedCollectionId,
        focusedGranuleId,
        granules: granuleData,
        imageryCache,
        isProjectPage,
        lightColor,
        metadata,
        onChangeFocusedGranule,
        onExcludeGranule,
        onMetricsMap,
        project,
        projection,
        removedGranuleIds
      })

      if (focusedCollectionId === collectionId) {
        layer.setZIndex(layerBuffer + 2)
      } else {
        layer.setZIndex(layerBuffer + 1)
      }

      layer.getLayerData = getLayerData

      // Add the layer to the feature group
      layer.addTo(instance)
    }
  })
}

const GranuleGridLayer = createLayerComponent(createGranuleGridLayer, updateGranuleGridLayer)
export default GranuleGridLayer
