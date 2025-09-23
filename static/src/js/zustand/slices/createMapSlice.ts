import {
  ImmerStateCreator,
  MapSlice,
  MapLayer
} from '../types'

import projectionCodes from '../../constants/projectionCodes'
import { projectionConfigs } from '../../util/map/crs'

const createMapSlice: ImmerStateCreator<MapSlice> = (set) => ({
  map: {
    mapView: {
      base: {
        worldImagery: true,
        trueColor: false,
        landWaterMap: false
      },
      latitude: 0,
      longitude: 0,
      overlays: {
        bordersRoads: true,
        coastlines: false,
        placeLabels: true
      },
      projection: projectionCodes.geographic,
      rotation: 0,
      zoom: projectionConfigs[projectionCodes.geographic].zoom
    },
    setMapView: (mapView) => {
      set((state) => {
        state.map.mapView = {
          ...state.map.mapView,
          ...mapView
        }
      })
    },
    /** Store layers for each collection */
    mapLayers: {},
    setMapLayers: (collectionId, layers: MapLayer[]) => {
      set((state) => {
        /** Set default visibility: first layer visible, rest hidden */
        const layersWithVisibility = layers.map((layer, index) => ({
          ...layer,
          isVisible: index === 0,
          opacity: 1.0
        }))
        state.map.mapLayers[collectionId] = layersWithVisibility
      })
    },
    toggleLayerVisibility: (collectionId, productName) => {
      set((state) => {
        const collectionLayers = state.map.mapLayers[collectionId]
        if (collectionLayers) {
          const targetLayer = collectionLayers.find((layer) => layer.product === productName)
          if (targetLayer) {
            targetLayer.isVisible = !targetLayer.isVisible
          }
        }
      })
    },

    /**
     * Reorder layers when they are dragged and dropped
     */
    setMapLayersOrder: (collectionId, newOrder: MapLayer[]) => {
      set((state) => {
        state.map.mapLayers[collectionId] = newOrder
      })
    },

    /**
     * Update the opacity of a specific layer
     */
    setLayerOpacity: (collectionId, productName, opacity) => {
      set((state) => {
        const collectionLayers = state.map.mapLayers[collectionId]
        if (collectionLayers) {
          const targetLayer = collectionLayers.find((layer) => layer.product === productName)
          if (targetLayer) {
            targetLayer.opacity = opacity
          }
        }
      })
    },

    showMbr: false,
    setShowMbr: (showMbr) => {
      set((state) => {
        state.map.showMbr = showMbr
      })
    }
  }
})

export default createMapSlice
