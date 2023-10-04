import setTemporalFilters from '../setTemporalFilters'

// Input functions
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

beforeEach(() => {
  jest.clearAllMocks()
})

describe('setTemporalFilters', () => {
  test('calls passed in functions', () => {
    const mockStartDate = 'mock-date'
    const mockEndDate = 'mock-date'
    const mockEvent = {
      collection: {
        temporal: {
          startDate: mockStartDate,
          endDate: mockEndDate
        }
      }
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

  test('if `startDate is not provided', () => {
    const mockEndDate = 'mock-date'
    const mockEvent = {
      collection: {
        temporal: {
          startDate: null,
          endDate: mockEndDate
        }
      }
    }

    setTemporalFilters(mockEvent, eventHandlers)
    // Test that state update functions are called
    expect(setTemporalFilterStartDate).toHaveBeenCalledTimes(1)
    expect(setTemporalFilterStartDate).toHaveBeenCalledWith(null)

    expect(setTemporalFilterEndDate).toHaveBeenCalledTimes(1)
    expect(setTemporalFilterEndDate).toHaveBeenCalledWith(mockEndDate)

    // Test that a call to the database is made
    expect(onFetchAdminMetricsRetrievals).toHaveBeenCalledTimes(1)
  })

  test('if `endDate is not provided', () => {
    const mockStartDate = 'mock-date'
    const mockEvent = {
      collection: {
        temporal: {
          startDate: mockStartDate,
          endDate: null
        }
      }
    }

    setTemporalFilters(mockEvent, eventHandlers)
    // Test that state update functions are called
    expect(setTemporalFilterStartDate).toHaveBeenCalledTimes(1)
    expect(setTemporalFilterStartDate).toHaveBeenCalledWith(mockStartDate)

    expect(setTemporalFilterEndDate).toHaveBeenCalledTimes(1)
    expect(setTemporalFilterEndDate).toHaveBeenCalledWith(null)

    // Test that a call to the database is made
    expect(onFetchAdminMetricsRetrievals).toHaveBeenCalledTimes(1)
  })

  test('when neither the startDate or the endDate are passed', () => {
    const mockEvent = {
      collection: {
        temporal: {
          startDate: null,
          endDate: null
        }
      }
    }

    setTemporalFilters(mockEvent, eventHandlers)

    expect(setTemporalFilterStartDate).toHaveBeenCalledTimes(0)
    expect(setTemporalFilterEndDate).toHaveBeenCalledTimes(0)

    expect(onFetchAdminMetricsRetrievals).toHaveBeenCalledTimes(0)
  })
})
