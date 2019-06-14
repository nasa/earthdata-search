import moxios from 'moxios'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { getProjectCollectionsResponse } from './mocks'
import actions from '../index'

import {
  ADD_COLLECTION_TO_PROJECT,
  REMOVE_COLLECTION_FROM_PROJECT,
  UPDATE_AUTH,
  UPDATE_COLLECTION_METADATA,
  UPDATE_PROJECT_GRANULES,
  TOGGLE_COLLECTION_VISIBILITY
} from '../../constants/actionTypes'

import {
  addCollectionToProject,
  addProjectCollection,
  getProjectCollections,
  getProjectGranules,
  removeCollectionFromProject,
  toggleCollectionVisibility
} from '../project'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('addCollectionToProject', () => {
  test('should create an action to add the collection to a project', () => {
    const payload = 'collectionId'
    const expectedAction = {
      type: ADD_COLLECTION_TO_PROJECT,
      payload
    }
    expect(addCollectionToProject(payload)).toEqual(expectedAction)
  })
})

describe('removeCollectionFromProject', () => {
  test('should create an action to remove the collection from a project', () => {
    const payload = 'collectionId'
    const expectedAction = {
      type: REMOVE_COLLECTION_FROM_PROJECT,
      payload
    }
    expect(removeCollectionFromProject(payload)).toEqual(expectedAction)
  })
})

describe('toggleCollectionVisibility', () => {
  test('should create an action to update the collection visibility', () => {
    const payload = 'collectionId'
    const expectedAction = {
      type: TOGGLE_COLLECTION_VISIBILITY,
      payload
    }
    expect(toggleCollectionVisibility(payload)).toEqual(expectedAction)
  })
})

describe('getProjectGranules', () => {
  beforeEach(() => {
    moxios.install()

    jest.clearAllMocks()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  test('calls lambda to get authenticated granules', async () => {
    const granules = [{
      id: 'granuleId1',
      mockCollectionData: 'goes here'
    },
    {
      id: 'granuleId2',
      mockCollectionData: 'collection data 2'
    }]
    moxios.stubRequest(/3001\/granules.*/, {
      status: 200,
      response: {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.json',
          title: 'ECHO dataset metadata',
          entry: granules,
          facets: {}
        }
      },
      headers: {
        'cmr-hits': 2,
        'jwt-token': 'token'
      }
    })

    // mockStore with initialState
    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {
          allIds: ['collectionId1', 'collectionId2'],
          byId: {
            collectionId1: {
              granules: {}
            },
            collectionId2: {
              granules: {}
            }
          },
          projectIds: ['collectionId1', 'collectionId2']
        }
      },
      focusedCollection: '',
      query: {
        collection: {},
        granule: {}
      }
    })

    // call the dispatch
    await store.dispatch(getProjectGranules()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_AUTH,
        payload: 'token'
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_PROJECT_GRANULES,
        payload: {
          collectionId: 'collectionId1',
          hits: 2,
          isCwic: false,
          results: granules,
          totalSize: {
            size: '0.0',
            unit: 'MB'
          }
        }
      })
    })
  })

  test('does not call updateProjectGranules on error', async () => {
    moxios.stubRequest(/3001\/granules.*/, {
      status: 500,
      response: {}
    })

    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {
          allIds: ['collectionId1'],
          byId: {
            collectionId1: {
              granules: {}
            }
          },
          projectIds: ['collectionId1']
        }
      },
      focusedCollection: '',
      query: {
        collection: {},
        granule: {}
      }
    })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    await store.dispatch(getProjectGranules()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('getProjectCollections', () => {
  beforeEach(() => {
    moxios.install()

    jest.clearAllMocks()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  test('calls lambda to get authenticated collections', async () => {
    moxios.stubRequest(/3001\/collections\/json/, {
      status: 200,
      response: {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic',
          title: 'ECHO dataset metadata',
          entry: [{
            id: 'collectionId1',
            mockCollectionData: 'goes here'
          },
          {
            id: 'collectionId2',
            mockCollectionData: 'collection data 2'
          }],
          facets: {}
        }
      },
      headers: {
        'cmr-hits': 1,
        'jwt-token': 'token'
      }
    })

    moxios.stubRequest(/3001\/collections\/umm_json/, {
      status: 200,
      response: {
        hits: 1,
        took: 234,
        items: [
          {
            meta: {
              'concept-id': 'collectionId1'
            },
            umm: {
              data: 'collectionId1'
            }
          },
          {
            meta: {
              'concept-id': 'collectionId2'
            },
            umm: {
              data: 'collectionId2'
            }
          }
        ]
      },
      headers: {
        'cmr-hits': 1,
        'jwt-token': 'token'
      }
    })

    const getProjectGranulesMock = jest.spyOn(actions, 'getProjectGranules')
    getProjectGranulesMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {
          allIds: [],
          byId: {},
          projectIds: ['collectionId1', 'collectionId2']
        }
      },
      focusedCollection: '',
      query: {
        collection: {}
      }
    })

    // call the dispatch
    await store.dispatch(getProjectCollections()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_AUTH,
        payload: 'token'
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_COLLECTION_METADATA,
        payload: getProjectCollectionsResponse
      })

      expect(getProjectGranulesMock).toHaveBeenCalledTimes(1)
    })
  })

  test('does not call updateCollectionMetadata if no projectIds exist', () => {
    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {
          allIds: [],
          byId: {},
          projectIds: []
        }
      },
      focusedCollection: '',
      query: {
        collection: {}
      }
    })

    expect(store.dispatch(getProjectCollections())).toBeNull()
  })

  test('does not call updateCollectionMetadata on error', async () => {
    moxios.stubRequest(/3001\/collections.*/, {
      status: 500,
      response: {}
    })

    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {
          allIds: [],
          byId: {},
          projectIds: ['collectionId']
        }
      },
      focusedCollection: '',
      query: {
        collection: {}
      }
    })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    await store.dispatch(getProjectCollections()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('addProjectCollection', () => {
  test('adds project to the collection and calls getProjectCollections', () => {
    const collectionId = 'collectionId'

    // mock getProjectCollections
    const getProjectCollectionsMock = jest.spyOn(actions, 'getProjectCollections')
    getProjectCollectionsMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {
          allIds: [],
          byId: {},
          projectIds: []
        }
      },
      focusedCollection: '',
      query: {
        collection: {}
      }
    })

    // call the dispatch
    store.dispatch(addProjectCollection(collectionId))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: ADD_COLLECTION_TO_PROJECT,
      payload: collectionId
    })

    // was getProjectCollections called
    expect(getProjectCollectionsMock).toHaveBeenCalledTimes(1)
  })
})
