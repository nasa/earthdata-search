import setTemporalFilters from '../setTemporalFilters'

describe('setTemporalFilters', () => {
  test('calls passed in functions', () => {
    const mockStartDate = 'mock-Date'
    const mockEndDate = 'mock-Date'
    const mockEvent = {
      collection: {
        temporal: {
          startDate: mockStartDate,
          endDate: mockEndDate
        }
      }
    }

    const onUpdateAdminMetricsRetrievalsStartDate = jest.fn()
    const onUpdateAdminMetricsRetrievalsEndDate = jest.fn()
    const setTemporalFilterStartDate = jest.fn()
    const setTemporalFilterEndDate = jest.fn()
    const onFetchAdminMetricsRetrievals = jest.fn()

    const eventHandlers = {
      onUpdateAdminMetricsRetrievalsStartDate,
      onUpdateAdminMetricsRetrievalsEndDate,
      setTemporalFilterStartDate,
      setTemporalFilterEndDate,
      onFetchAdminMetricsRetrievals
    }
    setTemporalFilters(mockEvent, eventHandlers)
    // Test redux` store functions are called
    expect(onUpdateAdminMetricsRetrievalsStartDate).toHaveBeenCalledTimes(1)
    expect(onUpdateAdminMetricsRetrievalsStartDate).toHaveBeenCalledWith(mockStartDate)

    expect(onUpdateAdminMetricsRetrievalsEndDate).toHaveBeenCalledTimes(1)
    expect(onUpdateAdminMetricsRetrievalsEndDate).toHaveBeenCalledWith(mockEndDate)

    // Test that state update functions are called
    expect(setTemporalFilterStartDate).toHaveBeenCalledTimes(1)
    expect(setTemporalFilterStartDate).toHaveBeenCalledWith(mockStartDate)

    expect(setTemporalFilterEndDate).toHaveBeenCalledTimes(1)
    expect(setTemporalFilterEndDate).toHaveBeenCalledWith(mockEndDate)

    // Test that a call to the database is made
    expect(onFetchAdminMetricsRetrievals).toHaveBeenCalledTimes(1)
  })
})
