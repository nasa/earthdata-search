import {
  SET_ADMIN_PROJECT,
  SET_ADMIN_PROJECTS,
  SET_ADMIN_PROJECT_LOADED,
  SET_ADMIN_PROJECT_LOADING,
  SET_ADMIN_PROJECTS_LOADED,
  SET_ADMIN_PROJECTS_LOADING,
  UPDATE_ADMIN_PROJECTS_SORT_KEY,
  UPDATE_ADMIN_PROJECTS_PAGE_NUM,
  SET_ADMIN_PROJECTS_PAGINATION
} from '../../../constants/actionTypes'

import adminProjectsReducer from '../projects'

const initialState = {
  allIds: [],
  byId: {},
  isLoading: false,
  isLoaded: false,
  sortKey: '',
  pagination: {
    pageSize: 20,
    pageNum: 1,
    pageCount: null,
    totalResults: null
  }
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(adminProjectsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('SET_ADMIN_PROJECTS_LOADED', () => {
  test('returns the correct state', () => {
    const action = {
      type: SET_ADMIN_PROJECTS_LOADED
    }

    const expectedState = {
      ...initialState,
      isLoaded: true,
      isLoading: false
    }

    expect(adminProjectsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SET_ADMIN_PROJECTS_LOADING', () => {
  test('returns the correct state', () => {
    const action = {
      type: SET_ADMIN_PROJECTS_LOADING
    }

    const expectedState = {
      ...initialState,
      isLoaded: false,
      isLoading: true
    }

    expect(adminProjectsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SET_ADMIN_PROJECTS', () => {
  test('returns the correct state', () => {
    const payload = [
      {
        obfuscated_id: 123456789,
        mock: 'data'
      },
      {
        obfuscated_id: 987654321,
        mock: 'data'
      }
    ]

    const action = {
      type: SET_ADMIN_PROJECTS,
      payload
    }

    const expectedState = {
      ...initialState,
      allIds: [123456789, 987654321],
      byId: {
        123456789: {
          obfuscated_id: 123456789,
          mock: 'data'
        },
        987654321: {
          obfuscated_id: 987654321,
          mock: 'data'
        }
      }
    }

    expect(adminProjectsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SET_ADMIN_PROJECT_LOADED', () => {
  test('returns the correct state', () => {
    const payload = 123

    const action = {
      type: SET_ADMIN_PROJECT_LOADED,
      payload
    }

    const expectedState = {
      ...initialState,
      byId: {
        [payload]: {
          isLoaded: true,
          isLoading: false
        }
      }
    }

    expect(adminProjectsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SET_ADMIN_PROJECT_LOADING', () => {
  test('returns the correct state', () => {
    const payload = 123

    const action = {
      type: SET_ADMIN_PROJECT_LOADING,
      payload
    }

    const expectedState = {
      ...initialState,
      byId: {
        [payload]: {
          isLoaded: false,
          isLoading: true
        }
      }
    }

    expect(adminProjectsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SET_ADMIN_PROJECT', () => {
  test('returns the correct state', () => {
    const payload = {
      obfuscated_id: 123456789,
      newMock: 'data'
    }

    const action = {
      type: SET_ADMIN_PROJECT,
      payload
    }

    const initial = {
      ...initialState,
      allIds: [123456789],
      byId: {
        123456789: {
          obfuscated_id: 123456789,
          mock: 'data'
        }
      }
    }

    const expectedState = {
      ...initial,
      allIds: [123456789],
      byId: {
        123456789: {
          obfuscated_id: 123456789,
          mock: 'data',
          newMock: 'data',
          isLoading: false,
          isLoaded: true
        }
      }
    }

    expect(adminProjectsReducer(initial, action)).toEqual(expectedState)
  })
})

describe('SET_ADMIN_PROJECTS_PAGINATION', () => {
  test('returns the correct state', () => {
    const payload = {
      page_num: 1,
      page_size: 20,
      page_count: 2,
      total_results: 25
    }

    const action = {
      type: SET_ADMIN_PROJECTS_PAGINATION,
      payload
    }

    const expectedState = {
      ...initialState,
      pagination: {
        pageNum: 1,
        pageSize: 20,
        pageCount: 2,
        totalResults: 25
      }
    }

    expect(adminProjectsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('UPDATE_ADMIN_PROJECTS_SORT_KEY', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_ADMIN_PROJECTS_SORT_KEY,
      payload: 'newSortKey'
    }

    const expectedState = {
      ...initialState,
      sortKey: 'newSortKey'
    }

    expect(adminProjectsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('UPDATE_ADMIN_PROJECTS_PAGE_NUM', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_ADMIN_PROJECTS_PAGE_NUM,
      payload: 3
    }

    const initial = {
      ...initialState,
      pagination: {
        pageNum: 1,
        pageSize: 20,
        pageCount: 3,
        totalResults: 55
      }
    }

    const expectedState = {
      ...initial,
      pagination: {
        ...initial.pagination,
        pageNum: 3
      }
    }

    expect(adminProjectsReducer(initial, action)).toEqual(expectedState)
  })
})
