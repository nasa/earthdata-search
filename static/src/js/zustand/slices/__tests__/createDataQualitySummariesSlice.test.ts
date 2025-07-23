import useEdscStore from '../../useEdscStore'

describe('createDataQualitySummariesSlice', () => {
  beforeEach(() => {
    useEdscStore.setState({
      dataQualitySummaries: {
        byCollectionId: {},
        setDataQualitySummaries: useEdscStore.getState()
          .dataQualitySummaries.setDataQualitySummaries
      }
    })
  })

  test('sets the default state', () => {
    const { dataQualitySummaries } = useEdscStore.getState()

    expect(dataQualitySummaries).toEqual({
      byCollectionId: {},
      setDataQualitySummaries: expect.any(Function)
    })
  })

  describe('setDataQualitySummaries', () => {
    test('sets data quality summaries for a collection', () => {
      const { setDataQualitySummaries } = useEdscStore.getState().dataQualitySummaries
      const catalogItemId = 'C10000001-EDSC'
      const summaries = [
        {
          id: '1234-ABCD-5678-EFGH-91011',
          summary: 'data quality summary'
        }
      ]

      setDataQualitySummaries(catalogItemId, summaries)

      const updatedState = useEdscStore.getState().dataQualitySummaries
      expect(updatedState.byCollectionId[catalogItemId]).toEqual(summaries)
    })

    test('overwrites existing data quality summaries for a collection', () => {
      const { setDataQualitySummaries } = useEdscStore.getState().dataQualitySummaries
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

      const initialState = useEdscStore.getState().dataQualitySummaries
      expect(initialState.byCollectionId[catalogItemId]).toEqual(initialSummaries)

      setDataQualitySummaries(catalogItemId, newSummaries)

      const updatedState = useEdscStore.getState().dataQualitySummaries
      expect(updatedState.byCollectionId[catalogItemId]).toEqual(newSummaries)
    })

    test('handles multiple collections independently', () => {
      const { setDataQualitySummaries } = useEdscStore.getState().dataQualitySummaries
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

      const updatedState = useEdscStore.getState().dataQualitySummaries
      expect(updatedState.byCollectionId[catalogItemId1]).toEqual(summaries1)
      expect(updatedState.byCollectionId[catalogItemId2]).toEqual(summaries2)
    })

    test('handles empty summaries array', () => {
      const { setDataQualitySummaries } = useEdscStore.getState().dataQualitySummaries
      const catalogItemId = 'C10000001-EDSC'
      const emptySummaries: Array<{id: string, summary: string}> = []

      setDataQualitySummaries(catalogItemId, emptySummaries)

      const updatedState = useEdscStore.getState().dataQualitySummaries
      expect(updatedState.byCollectionId[catalogItemId]).toEqual([])
    })

    test('handles summaries with HTML content', () => {
      const { setDataQualitySummaries } = useEdscStore.getState().dataQualitySummaries
      const catalogItemId = 'C10000001-EDSC'
      const summaries = [
        {
          id: '1234-ABCD-5678-EFGH-91011',
          summary: '<p>This is a <strong>data quality summary</strong> with <a href="#">HTML content</a>.</p>'
        }
      ]

      setDataQualitySummaries(catalogItemId, summaries)

      const updatedState = useEdscStore.getState().dataQualitySummaries
      expect(updatedState.byCollectionId[catalogItemId]).toEqual(summaries)
    })
  })
})
