import queryReducer from '../query'
import {
  UPDATE_COLLECTION_QUERY,
  UPDATE_GRANULE_QUERY,
  RESTORE_FROM_URL,
  CLEAR_FILTERS,
  UPDATE_REGION_QUERY
} from '../../constants/actionTypes'

const initialState = {
  collection: {
    gridName: '',
    pageNum: 1,
    spatial: {},
    temporal: {},
    hasGranulesOrCwic: true
  },
  granule: {
    gridCoords: '',
    pageNum: 1
  },
  region: {
    exact: false
  }
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(queryReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_COLLECTION_QUERY', () => {
  test('returns the correct state', () => {
    const payload = {
      keyword: 'new keyword',
      pageNum: 1,
      spatial: {
        point: '0,0'
      },
      gridName: '',
      temporal: {}
    }
    const action = {
      type: UPDATE_COLLECTION_QUERY,
      payload
    }

    const expectedState = {
      collection: {
        ...payload,
        hasGranulesOrCwic: true
      },
      granule: {
        gridCoords: '',
        pageNum: 1
      },
      region: {
        exact: false
      }
    }

    expect(queryReducer(undefined, action)).toEqual(expectedState)
  })

  test('does not overwrite existing values', () => {
    const initialState = {
      collection: { keyword: 'old keyword' },
      granule: { pageNum: 1 }
    }
    const payload = {
      spatial: {
        point: '0,0'
      }
    }
    const action = {
      type: UPDATE_COLLECTION_QUERY,
      payload
    }
    const expectedState = {
      collection: {
        keyword: 'old keyword',
        spatial: {
          point: '0,0'
        }
      },
      granule: { pageNum: 1 }
    }

    expect(queryReducer(initialState, action)).toEqual(expectedState)
  })
})


describe('UPDATE_GRANULE_QUERY', () => {
  test('returns the correct state', () => {
    const payload = {
      gridCoords: '',
      pageNum: 1
    }
    const action = {
      type: UPDATE_GRANULE_QUERY,
      payload
    }

    const expectedState = {
      collection: {
        gridName: '',
        pageNum: 1,
        spatial: {},
        temporal: {},
        hasGranulesOrCwic: true
      },
      granule: payload,
      region: {
        exact: false
      }
    }

    expect(queryReducer(undefined, action)).toEqual(expectedState)
  })

  test('does not overwrite existing values', () => {
    const initialState = {
      collection: { keyword: 'old keyword' },
      granule: { pageNum: 1 }
    }
    const payload = {
      pageNum: 2
    }
    const action = {
      type: UPDATE_GRANULE_QUERY,
      payload
    }
    const expectedState = {
      collection: {
        keyword: 'old keyword'
      },
      granule: { pageNum: 2 }
    }

    expect(queryReducer(initialState, action)).toEqual(expectedState)
  })
})

describe('UPDATE_REGION_QUERY', () => {
  test('returns the correct state', () => {
    const payload = {
      exact: false,
      endpoint: 'region',
      keyword: 'test value'
    }
    const action = {
      type: UPDATE_REGION_QUERY,
      payload
    }

    const expectedState = {
      ...initialState,
      region: {
        ...payload
      }
    }

    expect(queryReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('RESTORE_FROM_URL', () => {
  test('returns the correct state', () => {
    const query = {
      collection: { pageNum: 1 },
      granule: { pageNum: 1 },
      region: {
        exact: true
      }
    }

    const action = {
      type: RESTORE_FROM_URL,
      payload: {
        query
      }
    }

    const expectedState = query

    expect(queryReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('CLEAR_FILTERS', () => {
  test('returns the correct state', () => {
    const action = { type: CLEAR_FILTERS }

    expect(queryReducer(undefined, action)).toEqual(initialState)
  })
})
