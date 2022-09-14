import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import actions from '../../index'
import {
  setAdminProject,
  setAdminProjects,
  setAdminProjectLoading,
  setAdminProjectLoaded,
  setAdminProjectsLoading,
  setAdminProjectsLoaded,
  setAdminProjectsPagination,
  fetchAdminProject,
  fetchAdminProjects,
  adminViewProject,
  updateAdminProjectsSortKey,
  updateAdminProjectsPageNum
} from '../projects'
import {
  SET_ADMIN_PROJECT,
  SET_ADMIN_PROJECTS,
  SET_ADMIN_PROJECT_LOADING,
  SET_ADMIN_PROJECT_LOADED,
  SET_ADMIN_PROJECTS_LOADING,
  SET_ADMIN_PROJECTS_LOADED,
  SET_ADMIN_PROJECTS_PAGINATION,
  UPDATE_ADMIN_PROJECTS_SORT_KEY,
  UPDATE_ADMIN_PROJECTS_PAGE_NUM
} from '../../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('setAdminProject', () => {
  test('should create an action to set the admin project data', () => {
    const payload = {
      mock: 'data'
    }

    const expectedAction = {
      type: SET_ADMIN_PROJECT,
      payload
    }

    expect(setAdminProject(payload)).toEqual(expectedAction)
  })
})

describe('setAdminProjects', () => {
  test('should create an action to update the admin projects list', () => {
    const payload = [
      {
        mock: 'data'
      },
      {
        mock: 'more data'
      }
    ]

    const expectedAction = {
      type: SET_ADMIN_PROJECTS,
      payload
    }

    expect(setAdminProjects(payload)).toEqual(expectedAction)
  })
})

describe('setAdminProjectsLoading', () => {
  test('should create an action to update the admin projects loading state', () => {
    const expectedAction = {
      type: SET_ADMIN_PROJECTS_LOADING
    }

    expect(setAdminProjectsLoading()).toEqual(expectedAction)
  })
})

describe('setAdminProjectsLoaded', () => {
  test('should create an action to update the admin projects loaded state', () => {
    const expectedAction = {
      type: SET_ADMIN_PROJECTS_LOADED
    }

    expect(setAdminProjectsLoaded()).toEqual(expectedAction)
  })
})

describe('setAdminProjectLoading', () => {
  test('should create an action to update an admin project loading state', () => {
    const payload = 123

    const expectedAction = {
      type: SET_ADMIN_PROJECT_LOADING,
      payload
    }

    expect(setAdminProjectLoading(123)).toEqual(expectedAction)
  })
})

describe('setAdminProjectLoaded', () => {
  test('should create an action to update an admin project loaded state', () => {
    const payload = 123

    const expectedAction = {
      type: SET_ADMIN_PROJECT_LOADED,
      payload
    }

    expect(setAdminProjectLoaded(123)).toEqual(expectedAction)
  })
})

describe('setAdminProjectsPagination', () => {
  test('should create an action to update the admin projects pagination state', () => {
    const payload = {
      mock: 'data'
    }

    const expectedAction = {
      type: SET_ADMIN_PROJECTS_PAGINATION,
      payload
    }

    expect(setAdminProjectsPagination(payload)).toEqual(expectedAction)
  })
})

describe('fetchAdminProject', () => {
  test('fetches a single admin project', async () => {
    const data = {
      mock: 'data'
    }

    nock(/localhost/)
      .get(/admin\/project/)
      .reply(200, data)

    const id = 123

    const store = mockStore({
      authToken: 'mockToken',
      admin: {
        isAuthorized: true
      }
    })

    await store.dispatch(fetchAdminProject(id)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: SET_ADMIN_PROJECT_LOADING,
        payload: id
      })
      expect(storeActions[1]).toEqual({
        type: SET_ADMIN_PROJECT_LOADED,
        payload: id
      })
      expect(storeActions[2]).toEqual({
        type: SET_ADMIN_PROJECT,
        payload: data
      })
    })
  })
})

describe('fetchAdminProjects', () => {
  test('fetches the list of admin projects', async () => {
    const data = {
      pagination: {
        pageNum: 1,
        pageSize: 20,
        pageCount: 1,
        totalResults: 1
      },
      results: [{ mock: 'data' }]
    }

    nock(/localhost/)
      .get(/admin\/project/)
      .reply(200, data)

    const store = mockStore({
      authToken: 'mockToken',
      admin: {
        isAuthorized: true,
        projects: {
          sortKey: '-created_at',
          pagination: {
            pageNum: 1,
            pageSize: 20
          }
        }
      }
    })

    await store.dispatch(fetchAdminProjects()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: SET_ADMIN_PROJECTS_LOADING
      })
      expect(storeActions[1]).toEqual({
        type: SET_ADMIN_PROJECTS_LOADED
      })
      expect(storeActions[2]).toEqual({
        type: SET_ADMIN_PROJECTS_PAGINATION,
        payload: data.pagination
      })
      expect(storeActions[3]).toEqual({
        type: SET_ADMIN_PROJECTS,
        payload: data.results
      })
    })
  })
})

describe('adminViewProject', () => {
  test('should create an action to change the URL', () => {
    const store = mockStore({
      router: {
        location: {
          pathname: '/admin'
        }
      }
    })

    store.dispatch(adminViewProject(123))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        args: [
          {
            pathname: '/admin/projects/123'
          }
        ],
        method: 'push'
      },
      type: '@@router/CALL_HISTORY_METHOD'
    })
  })
})

describe('updateAdminProjectsSortKey', () => {
  test('should create an action to update the sort key and call fetchAdminProjects', () => {
    const sortKey = '+username'

    const fetchAdminProjectsMock = jest.spyOn(actions, 'fetchAdminProjects')
    fetchAdminProjectsMock.mockImplementation(() => jest.fn())

    const store = mockStore({
      admin: {
        projects: {
          sortKey: '-created_at'
        }
      }
    })

    // call the dispatch
    store.dispatch(updateAdminProjectsSortKey(sortKey))

    // Is updateFeatureFacet called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_ADMIN_PROJECTS_SORT_KEY,
      payload: sortKey
    })

    expect(fetchAdminProjectsMock).toHaveBeenCalledTimes(1)
  })
})

describe('updateAdminProjectsPageNum', () => {
  test('should create an action to update the page num and call fetchAdminProjects', () => {
    const pageNum = 2

    const fetchAdminProjectsMock = jest.spyOn(actions, 'fetchAdminProjects')
    fetchAdminProjectsMock.mockImplementation(() => jest.fn())

    const store = mockStore({
      admin: {
        projects: {
          pagination: {
            pageNum: 1
          }
        }
      }
    })

    // call the dispatch
    store.dispatch(updateAdminProjectsPageNum(pageNum))

    // Is updateFeatureFacet called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_ADMIN_PROJECTS_PAGE_NUM,
      payload: pageNum
    })

    expect(fetchAdminProjectsMock).toHaveBeenCalledTimes(1)
  })
})
