import setTemporalFilters from '../setTemporalFilters'

// Input functions
const onUpdateAdminRetrievalsMetricsStartDate = jest.fn()
const onUpdateAdminRetrievalsMetricsEndDate = jest.fn()
const setTemporalFilterStartDate = jest.fn()
const setTemporalFilterEndDate = jest.fn()
const onFetchAdminRetrievalsMetrics = jest.fn()

const eventHandlers = {
  onUpdateAdminRetrievalsMetricsStartDate,
  onUpdateAdminRetrievalsMetricsEndDate,
  setTemporalFilterStartDate,
  setTemporalFilterEndDate,
  onFetchAdminRetrievalsMetrics
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
    // Test redux store functions are called
    expect(onUpdateAdminRetrievalsMetricsStartDate).toHaveBeenCalledTimes(1)
    expect(onUpdateAdminRetrievalsMetricsStartDate).toHaveBeenCalledWith(mockStartDate)

    expect(onUpdateAdminRetrievalsMetricsEndDate).toHaveBeenCalledTimes(1)
    expect(onUpdateAdminRetrievalsMetricsEndDate).toHaveBeenCalledWith(mockEndDate)

    // Test that state update functions are called
    expect(setTemporalFilterStartDate).toHaveBeenCalledTimes(1)
    expect(setTemporalFilterStartDate).toHaveBeenCalledWith(mockStartDate)

    expect(setTemporalFilterEndDate).toHaveBeenCalledTimes(1)
    expect(setTemporalFilterEndDate).toHaveBeenCalledWith(mockEndDate)

    // Test that a call to the database is made
    expect(onFetchAdminRetrievalsMetrics).toHaveBeenCalledTimes(1)
  })

  test('if `startDate` is not provided', () => {
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
    expect(onFetchAdminRetrievalsMetrics).toHaveBeenCalledTimes(1)
  })

  test('if `endDate` is not provided', () => {
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
    expect(onFetchAdminRetrievalsMetrics).toHaveBeenCalledTimes(1)
  })

  test('when neither the `startDate` or the `endDate` are passed', () => {
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

    expect(onFetchAdminRetrievalsMetrics).toHaveBeenCalledTimes(0)
  })
})
