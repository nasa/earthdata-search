import useEdscStore from '../../useEdscStore'

describe('createDataQualitySummariesSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { dataQualitySummaries } = zustandState

    expect(dataQualitySummaries).toEqual({
      byCollectionId: {},
      setDataQualitySummaries: expect.any(Function)
    })
  })

  describe('setDataQualitySummaries', () => {
    test('sets data quality summaries for a collection', () => {
      const zustandState = useEdscStore.getState()
      const { dataQualitySummaries } = zustandState
      const { setDataQualitySummaries } = dataQualitySummaries
      const catalogItemId = 'C10000001-EDSC'
      const summaries = [
        {
          id: 'ABCD-1234',
          summary: 'data quality summary'
        }
      ]

      setDataQualitySummaries(catalogItemId, summaries)

      const updatedState = useEdscStore.getState()
      const { dataQualitySummaries: updatedDataQualitySummaries } = updatedState
      expect(updatedDataQualitySummaries.byCollectionId[catalogItemId]).toEqual(summaries)
    })

    test('handles empty summaries array', () => {
      const zustandState = useEdscStore.getState()
      const { dataQualitySummaries } = zustandState
      const { setDataQualitySummaries } = dataQualitySummaries
      const catalogItemId = 'C10000001-EDSC'
      const emptySummaries: Array<{id: string, summary: string}> = []

      setDataQualitySummaries(catalogItemId, emptySummaries)

      const updatedState = useEdscStore.getState()
      const { dataQualitySummaries: updatedDataQualitySummaries } = updatedState
      expect(updatedDataQualitySummaries.byCollectionId[catalogItemId]).toEqual([])
    })
  })
})
