import { ImmerStateCreator, MapSlice } from '../types'

const createMapSlice: ImmerStateCreator<MapSlice> = (set) => ({
  map: {
    showMbr: false,
    setShowMbr: (showMbr: boolean) => {
      set((state) => {
        state.map.showMbr = showMbr
      })
    }
  }
})

export default createMapSlice
