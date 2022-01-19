/* eslint-disable no-underscore-dangle */

import L from 'leaflet'
import {
  difference,
  isEqual
} from 'lodash'

import {
  withLeaflet,
  MapLayer
} from 'react-leaflet'

import { getColorByIndex } from '../../util/colors'

import { GranuleGridLayerExtended } from './GranuleGridLayerExtended'

import './GranuleGridLayer.scss'

const layerBuffer = 20

export class GranuleGridLayer extends MapLayer {
  /**
   * Get the data needed to create a new GranuleGridLayerExtended layer
   * @param {object} props
   * @returns {array} Array of layer data objects
   */
  getLayerData(props) {
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

  /**
   * Create a feature group of GranuleGridLayerExtended layers.
   * @param {object} props
   */
  createLeafletElement(props) {
    const { layers = [] } = this

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
    const layerData = this.getLayerData(props)

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
    return featureGroup
  }

  /**
   * Handles updating the granules in each GranuleGridLayerExtended layer on the map
   * @param {object} fromProps
   * @param {obect} toProps
   */
  updateLeafletElement(fromProps, toProps) {
    const layers = this.leafletElement._layers // List of layers

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
    } = toProps

    this.isProjectPage = isProjectPage

    const {
      drawingNewLayer: fromDrawingNewLayer,
      focusedGranuleId: oldFocusedGranule,
      focusedCollectionId: oldFocusedCollection,
      isProjectPage: oldIsProjectPage
    } = fromProps

    const oldLayerData = this.getLayerData(fromProps)
    const layerData = this.getLayerData(toProps)

    const layerDataCollectionIds = Object.keys(layerData)

    // Nothing should be drawn, remove any existing layers
    if (layerDataCollectionIds.length === 0) {
      Object.values(layers).forEach((layer) => this.leafletElement.removeLayer(layer))
    } else if (layerDataCollectionIds.length < Object.keys(oldLayerData).length) {
      // If there is less data than before, figure out which collection was removed and remove the layer

      const oldIds = Object.keys(oldLayerData)
      const diffIds = difference(oldIds, layerDataCollectionIds)

      diffIds.forEach((collectionId) => {
        Object.values(layers).forEach((layer) => {
          if (layer.collectionId === collectionId) {
            this.leafletElement.removeLayer(layer)
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
      const [layer] = Object.values(layers).filter((l) => l.collectionId === collectionId)

      const { project: fromPropsProject } = fromProps
      const { collections: fromPropsProjectCollections = {} } = fromPropsProject
      const { byId: fromPropsProjectCollectionsById = {} } = fromPropsProjectCollections
      const { [collectionId]: oldProjectCollection = {} } = fromPropsProjectCollectionsById
      const { granules: oldProjectGranules = {} } = oldProjectCollection

      const { collections: projectCollections = {} } = project
      const { byId: projectCollectionsById = {} } = projectCollections
      const { [collectionId]: projectCollection = {} } = projectCollectionsById
      const { granules: newGranules = {} } = projectCollection

      let oldAddedGranuleIds
      let oldRemovedGranuleIds
      let addedGranuleIds
      let removedGranuleIds

      if (oldProjectGranules) {
        ({
          addedGranuleIds: oldAddedGranuleIds,
          removedGranuleIds: oldRemovedGranuleIds
        } = oldProjectGranules)
      }

      if (newGranules) {
        ({
          addedGranuleIds,
          removedGranuleIds
        } = newGranules)
      }

      // If there are no granules, bail out
      const { byId: granulesById = {} } = granules

      // If no granules were changed, bail out
      const oldCollection = oldLayerData[collectionId]
      const { granules: oldGranules = {} } = oldCollection || {}
      const { byId: oldGranulesById = {} } = oldGranules

      if (
        oldCollection
        && oldIsProjectPage !== isProjectPage
        && oldFocusedCollection !== focusedCollectionId
        && oldFocusedGranule !== focusedGranuleId
        && isEqual(Object.keys(granulesById), Object.keys(oldGranulesById))
        && isEqual(addedGranuleIds, oldAddedGranuleIds)
        && isEqual(removedGranuleIds, oldRemovedGranuleIds)
      ) {
        // If no granules were changed, but drawingNewLayer was changed, update the layer
        if (fromDrawingNewLayer !== drawingNewLayer) {
          layer.setDrawingNewLayer(drawingNewLayer)
        }

        return
      }

      // If the collecton is not visible, set the granuleData to an empty array
      const granuleData = isVisible ? Object.values(granulesById) : []

      this.addedGranuleIds = addedGranuleIds
      this.removedGranuleIds = removedGranuleIds

      if (layer) {
        const {
          isVisible: oldIsVisible
        } = oldCollection

        // If the granules and the visibility haven't changed, bail out
        if (
          oldGranules === granules
          && oldIsVisible === isVisible
          && oldFocusedCollection === focusedCollectionId
          && isEqual(addedGranuleIds, oldAddedGranuleIds)
          && isEqual(removedGranuleIds, oldRemovedGranuleIds)
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

        layer.getLayerData = this.getLayerData

        // Add the layer to the feature group
        layer.addTo(this.leafletElement)
      }
    })
  }
}

export default withLeaflet(GranuleGridLayer)
