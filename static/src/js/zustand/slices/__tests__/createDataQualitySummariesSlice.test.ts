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
          id: '1234-ABCD-5678-EFGH-91011',
          summary: 'data quality summary'
        }
      ]

      setDataQualitySummaries(catalogItemId, summaries)

      const updatedState = useEdscStore.getState()
      const { dataQualitySummaries: updatedDataQualitySummaries } = updatedState
      expect(updatedDataQualitySummaries.byCollectionId[catalogItemId]).toEqual(summaries)
    })

    test('overwrites existing data quality summaries for a collection', () => {
      const zustandState = useEdscStore.getState()
      const { dataQualitySummaries } = zustandState
      const { setDataQualitySummaries } = dataQualitySummaries
      const catalogItemId = 'C10000001-EDSC'
      const initialSummaries = [
        {
          id: 'initial-id',
          summary: 'initial summary'
        }
      ]
      const newSummaries = [
        {
          id: '1234-ABCD-5678-EFGH-91011',
          summary: 'updated data quality summary'
        }
      ]

      setDataQualitySummaries(catalogItemId, initialSummaries)

      const initialState = useEdscStore.getState()
      const { dataQualitySummaries: initialDataQualitySummaries } = initialState
      expect(initialDataQualitySummaries.byCollectionId[catalogItemId]).toEqual(initialSummaries)

      setDataQualitySummaries(catalogItemId, newSummaries)

      const updatedState = useEdscStore.getState()
      const { dataQualitySummaries: updatedDataQualitySummaries } = updatedState
      expect(updatedDataQualitySummaries.byCollectionId[catalogItemId]).toEqual(newSummaries)
    })

    test('handles multiple collections independently', () => {
      const zustandState = useEdscStore.getState()
      const { dataQualitySummaries } = zustandState
      const { setDataQualitySummaries } = dataQualitySummaries
      const catalogItemId1 = 'C10000001-EDSC'
      const catalogItemId2 = 'C10000002-EDSC'
      const summaries1 = [
        {
          id: 'id-1',
          summary: 'summary for collection 1'
        }
      ]
      const summaries2 = [
        {
          id: 'id-2',
          summary: 'summary for collection 2'
        }
      ]

      setDataQualitySummaries(catalogItemId1, summaries1)
      setDataQualitySummaries(catalogItemId2, summaries2)

      const updatedState = useEdscStore.getState()
      const { dataQualitySummaries: updatedDataQualitySummaries } = updatedState
      expect(updatedDataQualitySummaries.byCollectionId[catalogItemId1]).toEqual(summaries1)
      expect(updatedDataQualitySummaries.byCollectionId[catalogItemId2]).toEqual(summaries2)
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

    test('handles summaries with HTML content', () => {
      const zustandState = useEdscStore.getState()
      const { dataQualitySummaries } = zustandState
      const { setDataQualitySummaries } = dataQualitySummaries
      const catalogItemId = 'C10000001-EDSC'
      const summaries = [
        {
          id: '1234-ABCD-5678-EFGH-91011',
          summary: '<p>This is a <strong>data quality summary</strong> with <a href="#">HTML content</a>.</p>'
        }
      ]

      setDataQualitySummaries(catalogItemId, summaries)

      const updatedState = useEdscStore.getState()
      const { dataQualitySummaries: updatedDataQualitySummaries } = updatedState
      expect(updatedDataQualitySummaries.byCollectionId[catalogItemId]).toEqual(summaries)
    })
  })
})
