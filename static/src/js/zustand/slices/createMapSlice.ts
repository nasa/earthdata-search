import { ImmerStateCreator, MapSlice } from '../types'

const createMapSlice: ImmerStateCreator<MapSlice> = (set) => ({
  map: {
    showMbr: false,
    setShowMbr: (showMbr) => {
      set((state) => {
        state.map.showMbr = showMbr
      })
    }
  }
})

export default createMapSlice
