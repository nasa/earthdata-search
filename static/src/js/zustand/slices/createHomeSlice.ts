import { HomeSlice, ImmerStateCreator } from '../types'

const createHomeSlice: ImmerStateCreator<HomeSlice> = (set) => ({
  home: {
    startDrawing: false,
    setStartDrawing: (startDrawing) => {
      set((state) => {
        state.home.startDrawing = startDrawing
      })
    },
    nlpAutoCenterPending: false,
    setNlpAutoCenterPending: (isPending) => {
      set((state) => {
        state.home.nlpAutoCenterPending = isPending
      })
    },
    openFacetGroup: null,
    setOpenFacetGroup: (groupName) => {
      set((state) => {
        state.home.openFacetGroup = groupName
      })
    }
  }
})

export default createHomeSlice
