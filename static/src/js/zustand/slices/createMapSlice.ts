import { ImmerStateCreator, MapSlice } from '../types'

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
    // Store layers for each collection
    mapLayers: {},
    setMapLayers: (collectionId: string, layers: Array<{
      product: string
      title?: string
      format?: string
      layerPeriod?: string
      antarctic_resolution?: string
      arctic_resolution?: string
      geographic_resolution?: string
      antarctic?: boolean
      arctic?: boolean
      geographic?: boolean
    }>) => {
      set((state) => {
        // Set default visibility: first layer visible, rest hidden
        const layersWithVisibility = layers.map((layer, index) => ({
          ...layer,
          isVisible: index === 0,
          opacity: 1.0
        }))
        state.map.mapLayers[collectionId] = layersWithVisibility
      })
    },
    toggleLayerVisibility: (collectionId: string, productName: string) => {
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
    setMapLayersOrder: (collectionId: string, newOrder: Array<{
      product: string
      title?: string
      format?: string
      layerPeriod?: string
      antarctic_resolution?: string
      arctic_resolution?: string
      geographic_resolution?: string
      antarctic?: boolean
      arctic?: boolean
      geographic?: boolean
      isVisible?: boolean
      opacity?: number
    }>) => {
      set((state) => {
        state.map.mapLayers[collectionId] = newOrder
      })
    },

    /**
     * Update the opacity of a specific layer
     */
    updateLayerOpacity: (collectionId: string, productName: string, opacity: number) => {
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
