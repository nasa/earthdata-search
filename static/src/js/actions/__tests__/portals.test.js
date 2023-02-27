import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { ADD_ERROR, ADD_PORTAL } from '../../constants/actionTypes'
import { displayNotificationType } from '../../constants/enums'
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
      features: {
        advancedSearch: true,
        authentication: true,
        featureFacets: {
          showAvailableInEarthdataCloud: true,
          showCustomizable: true,
          showMapImagery: true
        }
      },
      footer: {
        displayVersion: true,
        attributionText: 'NASA Official: Stephen Berrick',
        primaryLinks: [{
          title: 'FOIA',
          href: 'http://www.nasa.gov/FOIA/index.html'
        },
        {
          title: 'NASA Privacy Policy',
          href: 'http://www.nasa.gov/about/highlights/HP_Privacy.html'
        },
        {
          title: 'USA.gov',
          href: 'http://www.usa.gov'
        }],
        secondaryLinks: [{
          title: 'Earthdata Access: A Section 508 accessible alternative',
          href: 'https://access.earthdata.nasa.gov/'
        }]
      },
      hasScripts: false,
      hasStyles: false,
      logo: {},
      org: 'Earthdata',
      pageTitle: 'Earthdata Search',
      query: {
        echoCollectionId: 'C203234523-LAADS'
      },
      title: 'Search',
      ui: {
        showOnlyGranulesCheckbox: true,
        showNonEosdisCheckbox: true,
        showTophat: true
      },
      parentConfig: 'edsc'
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

  test('should call addError when unable to load portal config', () => {
    const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => {})
    const portalId = 'not-a-real-portal'

    // mockStore with initialState
    const store = mockStore()

    // call the dispatch
    store.dispatch(loadPortalConfig(portalId))

    expect(consoleMock).toHaveBeenCalledTimes(1)

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: ADD_ERROR,
      payload: {
        id: portalId,
        notificationType: displayNotificationType.banner,
        title: `Portal ${portalId} could not be loaded`
      }
    })
  })
})
