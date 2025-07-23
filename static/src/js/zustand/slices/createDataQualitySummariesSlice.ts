import { DataQualitySummariesSlice, ImmerStateCreator } from '../types'

const createDataQualitySummariesSlice: ImmerStateCreator<DataQualitySummariesSlice> = (set) => ({
  dataQualitySummaries: {
    byCollectionId: {},

    setDataQualitySummaries: (catalogItemId, summaries) => {
      set((state) => {
        state.dataQualitySummaries.byCollectionId[catalogItemId] = summaries
      })
    }
  }
})

export default createDataQualitySummariesSlice
