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

    showMbr: false,
    setShowMbr: (showMbr) => {
      set((state) => {
        state.map.showMbr = showMbr
      })
    }
  }
})

export default createMapSlice
