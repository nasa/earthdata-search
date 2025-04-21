import { HomeSlice, ImmerStateCreator } from '../types'

const createHomeSlice: ImmerStateCreator<HomeSlice> = (set) => ({
  home: {
    startDrawing: false,
    setStartDrawing: (startDrawing: boolean | string) => {
      set((state) => {
        state.home.startDrawing = startDrawing
      })
    },
    openKeywordFacet: false,
    setOpenKeywordFacet: (openKeywordFacet: boolean) => {
      set((state) => {
        state.home.openKeywordFacet = openKeywordFacet
      })
    }
  }
})

export default createHomeSlice
