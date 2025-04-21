import { StateCreator } from 'zustand'
import { EdscStore, HomeSlice } from '../types'

const createHomeSlice: StateCreator<HomeSlice> = (set) => ({
  home: {
    startDrawing: false,
    setStartDrawing: (startDrawing: boolean | string) => {
      set((state: EdscStore) => ({
        ...state,
        home: {
          ...state.home,
          startDrawing
        }
      }))
    },
    openKeywordFacet: false,
    setOpenKeywordFacet: (openKeywordFacet: boolean) => {
      set((state: EdscStore) => ({
        ...state,
        home: {
          ...state.home,
          openKeywordFacet
        }
      }))
    }
  }
})

export default createHomeSlice
