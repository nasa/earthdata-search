import { ImmerStateCreator, MapSlice } from '../types'

import projectionCodes from '../../constants/projectionCodes'
import { projectionConfigs } from '../../util/map/crs'

export const initialMapView = {
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
}

const createMapSlice: ImmerStateCreator<MapSlice> = (set) => ({
  map: {
    mapView: initialMapView,
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
    setMapLayers: (collectionId, layers) => {
      set((state) => {
        /** Filter layers to only include unique products, keeping the first occurrence
         * Once UMM-Vis is incorporated we can just use concept-id
        */
        const uniqueLayers = layers.filter((layer, index, layerList) => layerList
          .findIndex((l) => l.product === layer.product)
         === index)

        /** Set default visibility: first layer visible, rest hidden */
        const layersWithVisibility = uniqueLayers.map((layer, index) => ({
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
    setMapLayersOrder: (collectionId, newOrder) => {
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
