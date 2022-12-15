import subscriptionsReducer from '../subscriptions'

import {
  ERRORED_SUBSCRIPTIONS,
  FINISHED_SUBSCRIPTIONS_TIMER,
  LOADED_SUBSCRIPTIONS,
  LOADING_SUBSCRIPTIONS,
  REMOVE_SUBSCRIPTION,
  STARTED_SUBSCRIPTIONS_TIMER,
  UPDATE_COLLECTION_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION_DISABLED_FIELDS,
  UPDATE_SUBSCRIPTION_RESULTS
} from '../../constants/actionTypes'

const initialState = {
  byId: {},
  isLoading: false,
  isLoaded: false,
  error: null,
  timerStart: null,
  loadTime: 0,
  disabledFields: {
    collection: {},
    granule: {}
  }
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(subscriptionsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('STARTED_SUBSCRIPTIONS_TIMER', () => {
  test('returns the correct state', () => {
    const action = {
      type: STARTED_SUBSCRIPTIONS_TIMER
    }

    // Mock current time to equal 5
    jest.spyOn(Date, 'now').mockImplementation(() => 5)

    const expectedState = {
      ...initialState,
      timerStart: 5
    }

    expect(subscriptionsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('FINISHED_SUBSCRIPTIONS_TIMER', () => {
  test('returns the correct state', () => {
    const action = {
      type: FINISHED_SUBSCRIPTIONS_TIMER
    }

    // Set current time to 10, and future time to 15
    // Load time will equal 5
    jest.spyOn(Date, 'now').mockImplementation(() => 15)

    const start = 10

    const expectedState = {
      ...initialState,
      timerStart: null,
      loadTime: 5
    }

    expect(subscriptionsReducer({ ...initialState, timerStart: start }, action))
      .toEqual(expectedState)
  })
})

describe('UPDATE_COLLECTION_SUBSCRIPTION', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_COLLECTION_SUBSCRIPTION,
      payload: {
        conceptId: 'SUB100000-EDSC',
        query: 'point=0,0'
      }
    }

    const initial = {
      ...initialState,
      byId: {
        'SUB100000-EDSC': {
          conceptId: 'SUB100000-EDSC',
          name: 'Test Subscription',
          query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
        }
      }
    }

    const expectedState = {
      ...initial,
      error: null,
      byId: {
        'SUB100000-EDSC': {
          conceptId: 'SUB100000-EDSC',
          name: 'Test Subscription',
          query: 'point=0,0'
        }
      }
    }

    expect(subscriptionsReducer(initial, action)).toEqual(expectedState)
  })
})

describe('UPDATE_SUBSCRIPTION_RESULTS', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_SUBSCRIPTION_RESULTS,
      payload: [{
        collection: {
          conceptId: 'C100000-EDSC',
          title: 'Mattis Justo Vulputate Ullamcorper Amet.'
        },
        collectionConceptId: 'C100000-EDSC',
        conceptId: 'SUB100000-EDSC',
        name: 'Test Subscription',
        query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
      }]
    }

    const expectedState = {
      ...initialState,
      byId: {
        'SUB100000-EDSC': {
          collection: {
            conceptId: 'C100000-EDSC',
            title: 'Mattis Justo Vulputate Ullamcorper Amet.'
          },
          collectionConceptId: 'C100000-EDSC',
          conceptId: 'SUB100000-EDSC',
          name: 'Test Subscription',
          query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
        }
      }
    }

    expect(subscriptionsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('ERRORED_SUBSCRIPTIONS', () => {
  test('returns the correct state', () => {
    const action = {
      type: ERRORED_SUBSCRIPTIONS,
      payload: [{
        message: 'mock error'
      }]
    }

    const expectedState = {
      ...initialState,
      byId: {},
      error: 'mock error'
    }

    expect(subscriptionsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('LOADING_SUBSCRIPTIONS', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADING_SUBSCRIPTIONS
    }

    const expectedState = {
      ...initialState,
      isLoading: true,
      isLoaded: false
    }

    expect(subscriptionsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('LOADED_SUBSCRIPTIONS', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADED_SUBSCRIPTIONS,
      payload: {
        loaded: true
      }
    }

    const expectedState = {
      ...initialState,
      isLoading: false,
      isLoaded: true
    }

    expect(subscriptionsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('REMOVE_SUBSCRIPTION', () => {
  test('returns the correct state', () => {
    const action = {
      type: REMOVE_SUBSCRIPTION,
      payload: 'SUB1000-EDSC'
    }

    const initial = {
      ...initialState,
      byId: {
        'SUB1000-EDSC': {
          mock: 'data'
        },
        'SUB1001-EDSC': {
          mock: 'data'
        }
      }
    }

    const expectedState = {
      ...initial,
      byId: {
        'SUB1001-EDSC': {
          mock: 'data'
        }
      }
    }

    expect(subscriptionsReducer(initial, action)).toEqual(expectedState)
  })
})

describe('UPDATE_SUBSCRIPTION_DISABLED_FIELDS', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_SUBSCRIPTION_DISABLED_FIELDS,
      payload: {
        collection: {
          'mock-field-3': true
        }
      }
    }

    const initial = {
      ...initialState,
      disabledFields: {
        collection: {
          'mock-field-1': true
        },
        granule: {
          'mock-field-2': true
        }
      }
    }

    const expectedState = {
      ...initial,
      disabledFields: {
        collection: {
          'mock-field-1': true,
          'mock-field-3': true
        },
        granule: {
          'mock-field-2': true
        }
      }
    }

    expect(subscriptionsReducer(initial, action)).toEqual(expectedState)
  })
})
