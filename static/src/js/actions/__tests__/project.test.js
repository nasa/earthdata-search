import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { getProjectCollectionsResponse } from './mocks'
import actions from '../index'
import * as getEarthdataConfig from '../../../../../sharedUtils/config'
import * as cmrEnv from '../../../../../sharedUtils/cmrEnv'

import {
  ADD_ACCESS_METHODS,
  ADD_COLLECTION_TO_PROJECT,
  REMOVE_COLLECTION_FROM_PROJECT,
  RESTORE_PROJECT,
  SELECT_ACCESS_METHOD,
  SUBMITTED_PROJECT,
  SUBMITTING_PROJECT,
  TOGGLE_COLLECTION_VISIBILITY,
  UPDATE_ACCESS_METHOD,
  UPDATE_AUTH,
  UPDATE_COLLECTION_METADATA
} from '../../constants/actionTypes'

import {
  addCollectionToProject,
  addProjectCollection,
  getProjectCollections,
  removeCollectionFromProject,
  toggleCollectionVisibility,
  restoreProject,
  updateAccessMethod,
  selectAccessMethod,
  addAccessMethods,
  submittingProject,
  submittedProject
} from '../project'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()

  jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')
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

describe('restoreProject', () => {
  test('should create an action to restore project collections', () => {
    const payload = {
      collectionIds: ['collectionId1', 'collectionId2']
    }
    const expectedAction = {
      type: RESTORE_PROJECT,
      payload
    }
    expect(restoreProject(payload)).toEqual(expectedAction)
  })
})

describe('addAccessMethods', () => {
  test('should create an action to update an access method', () => {
    const payload = {
      collectionId: 'collectionId',
      isValid: true,
      method: {
        download: {
          type: 'download'
        }
      }
    }
    const expectedAction = {
      type: ADD_ACCESS_METHODS,
      payload
    }
    expect(addAccessMethods(payload)).toEqual(expectedAction)
  })
})

describe('updateAccessMethod', () => {
  test('should create an action to update an access method', () => {
    const payload = {
      collectionId: 'collectionId',
      isValid: true,
      method: {
        download: {
          type: 'download'
        }
      }
    }
    const expectedAction = {
      type: UPDATE_ACCESS_METHOD,
      payload
    }
    expect(updateAccessMethod(payload)).toEqual(expectedAction)
  })
})

describe('selectAccessMethod', () => {
  test('should create an action to select the access method and update the access methods', () => {
    const payload = {
      collectionId: 'collectionId',
      selectedAccessMethod: 'download'
    }

    // mockStore with initialState
    const store = mockStore({
      project: {
        byId: {},
        collectionIds: ['collectionId']
      }
    })

    // call the dispatch
    store.dispatch(selectAccessMethod(payload))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: SELECT_ACCESS_METHOD,
      payload
    })
  })

  describe('submittingProject', () => {
    test('should create an action to update the project submitting state', () => {
      const expectedAction = {
        type: SUBMITTING_PROJECT
      }
      expect(submittingProject()).toEqual(expectedAction)
    })
  })

  describe('submittedProject', () => {
    test('should create an action to update the project submitted state', () => {
      const expectedAction = {
        type: SUBMITTED_PROJECT
      }
      expect(submittedProject()).toEqual(expectedAction)
    })
  })

  test('should not update the access methods if the method already exists', () => {
    const payload = {
      collectionId: 'collectionId',
      selectedAccessMethod: 'download'
    }

    // mockStore with initialState
    const store = mockStore({
      project: {
        byId: {
          collectionId: {
            accessMethods: {
              download: {
                type: 'download'
              }
            },
            selectAccessMethod: 'mock'
          }
        },
        collectionIds: ['collectionId']
      }
    })

    // call the dispatch
    store.dispatch(selectAccessMethod(payload))
    const storeActions = store.getActions()
    expect(storeActions.length).toBe(1)
    expect(storeActions[0]).toEqual({
      type: SELECT_ACCESS_METHOD,
      payload
    })
  })
})

describe('getProjectCollections', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls lambda to get authenticated collections', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.earthdata.nasa.gov',
      opensearchRoot: 'https://cmr.earthdata.nasa.gov/opensearch'
    }))
    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')
    jest.spyOn(actions, 'fetchDataQualitySummaries').mockImplementation(() => jest.fn())

    nock(/localhost/)
      .post(/collections\/json/)
      .reply(200, {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic',
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
      {
        'cmr-hits': 1,
        'jwt-token': 'token'
      })

    nock(/localhost/)
      .post(/collections\/umm_json/)
      .reply(200, {
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
      {
        'cmr-hits': 1,
        'jwt-token': 'token'
      })

    nock(/localhost/)
      .post(/granules/)
      .reply(200, {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=collectionId',
          title: 'ECHO granule metadata',
          entry: [{
            id: 'G1000001-EDSC'
          }, {
            id: 'G1000002-EDSC'
          }]
        }
      }, {
        'cmr-hits': 1
      })

    nock(/localhost/)
      .get(/providers/)
      .reply(200, [
        {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'EDSC-TEST',
            provider_id: 'EDSC-TEST'
          }
        }, {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'NON-EDSC-TEST',
            provider_id: 'NON-EDSC-TEST'
          }
        }
      ])

    const getGranulesMock = jest.spyOn(actions, 'getGranules')
    getGranulesMock.mockImplementation(() => jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          feed: {
            updated: '2019-03-27T20:21:14.705Z',
            id: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=collectionId',
            title: 'ECHO granule metadata',
            entry: [{
              id: 'G1000001-EDSC'
            }, {
              id: 'G1000002-EDSC'
            }]
          }
        }
      ])))

    const fetchProvidersMock = jest.spyOn(actions, 'fetchProviders')
    fetchProvidersMock.mockImplementation(() => jest.fn().mockImplementation(() => Promise.resolve([
      {
        provider: {
          id: 'abcd-1234-efgh-5678',
          organization_name: 'EDSC-TEST',
          provider_id: 'EDSC-TEST'
        }
      }, {
        provider: {
          id: 'abcd-1234-efgh-5678',
          organization_name: 'NON-EDSC-TEST',
          provider_id: 'NON-EDSC-TEST'
        }
      }
    ])))

    const fetchAccessMethodsMock = jest.spyOn(actions, 'fetchAccessMethods')
    fetchAccessMethodsMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {
          allIds: [],
          byId: {}
        }
      },
      focusedCollection: '',
      project: {
        collectionIds: ['collectionId1', 'collectionId2']
      },
      providers: [
        {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'EDSC-TEST',
            provider_id: 'EDSC-TEST'
          }
        }, {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'NON-EDSC-TEST',
            provider_id: 'NON-EDSC-TEST'
          }
        }
      ],
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

      expect(getGranulesMock).toHaveBeenCalledTimes(1)
      expect(fetchProvidersMock).toHaveBeenCalledTimes(1)
      expect(fetchAccessMethodsMock).toHaveBeenCalledTimes(1)
    })
  })

  test('does not call updateCollectionMetadata if no projectIds exist', () => {
    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {
          allIds: [],
          byId: {}
        }
      },
      focusedCollection: '',
      project: {
        collectionIds: []
      },
      query: {
        collection: {}
      }
    })

    expect(store.dispatch(getProjectCollections())).toBeNull()
  })

  test('does not call updateCollectionMetadata on error', async () => {
    nock(/localhost/)
      .post(/collections/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {
          allIds: [],
          byId: {}
        }
      },
      focusedCollection: '',
      project: {
        collectionIds: ['collectionId']
      },
      query: {
        collection: {}
      }
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

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
          byId: {}
        }
      },
      focusedCollection: '',
      project: {
        collectionIds: []
      },
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
