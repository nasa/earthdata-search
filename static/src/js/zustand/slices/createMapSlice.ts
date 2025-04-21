import { StateCreator } from 'zustand'
import { EdscStore, MapSlice } from '../types'

const createMapSlice: StateCreator<MapSlice> = (set) => ({
  map: {
    showMbr: false,
    setShowMbr: (showMbr: boolean) => {
      set((state: EdscStore) => ({
        ...state,
        map: {
          ...state.map,
          showMbr
        }
      }))
    }
  }
})

export default createMapSlice
