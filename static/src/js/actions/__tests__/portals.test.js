import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { ADD_PORTAL } from '../../constants/actionTypes'
import { addPortal, loadPortalConfig } from '../portals'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('addPortal', () => {
  test('should create an action to add portal configs', () => {
    const payload = {
      portalId: 'simple',
      query: {
        echoCollectionId: 'C203234523-LAADS'
      },
      title: 'Simple'
    }

    const expectedAction = {
      type: ADD_PORTAL,
      payload
    }

    expect(addPortal(payload)).toEqual(expectedAction)
  })
})

describe('loadPortalConfig', () => {
  test('should load the portal config from a file', () => {
    const portalId = 'simple'

    const payload = {
      portalId: 'simple',
      hasStyles: false,
      hasScripts: false,
      query: {
        echoCollectionId: 'C203234523-LAADS'
      },
      hideCollectionFilters: false,
      org: 'Earthdata',
      pageTitle: 'Earthdata Search',
      title: 'Search',
      minimumTemporalDateString: '1960-01-01 00:00:00',
      datasource: {
        collectionPageSize: 20,
        granulePageSize: 20,
        granulePerOrder: 2000,
        maxCollectionPageSize: 2000,
        maxGranulePageSize: 2000,
        maxOrderSize: 1000000,
        authCallbackUriPath: '/urs_callback',
        authHost: 'https://urs.earthdata.nasa.gov',
        autocompleteEndpoint: '',
        collectionMetadataEndpoint: 'https://graphql.earthdata.nasa.gov/api',
        collectionSearchEndpoint: 'https://cmr.earthdata.nasa.gov/search/collections',
        granuleMetadataEndpoint: 'https://cmr.earthdata.nasa.gov/search/concepts',
        granuleSearchEndpoint: 'https://cmr.earthdata.nasa.gov/search/granules',
        opensearchGranuleEndpoint: 'https://cmr.earthdata.nasa.gov/opensearch/granules/descriptor_document.xml'
      }
    }

    // mockStore with initialState
    const store = mockStore()

    // call the dispatch
    store.dispatch(loadPortalConfig(portalId))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: ADD_PORTAL,
      payload
    })
  })
})
