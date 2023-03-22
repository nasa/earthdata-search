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
      portalId: 'example',
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
    const portalId = 'example'

    const payload = {
      description: 'Example portal only, not for use in EDSC',
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
        attributionText: 'NASA Official: Stephen Berrick',
        displayVersion: true,
        primaryLinks: [{
          href: 'http://www.nasa.gov/FOIA/index.html',
          title: 'FOIA'
        }, {
          href: 'http://www.nasa.gov/about/highlights/HP_Privacy.html',
          title: 'NASA Privacy Policy'
        }, {
          href: 'http://www.usa.gov',
          title: 'USA.gov'
        }],
        secondaryLinks: [{
          href: 'https://access.earthdata.nasa.gov/',
          title: 'Earthdata Access: A Section 508 accessible alternative'
        }]
      },
      hasLogo: false,
      hasScripts: false,
      hasStyles: false,
      logo: {},
      pageTitle: 'Example',
      parentConfig: 'edsc',
      portalBrowser: false,
      portalId: 'example',
      query: {
        echoCollectionId: 'C203234523-LAADS'
      },
      title: {
        primary: 'Example'
      },
      ui: {
        showNonEosdisCheckbox: true,
        showOnlyGranulesCheckbox: true,
        showTophat: true
      }
    }

    const parentPayload = {
      description: 'Example portal only, not for use in EDSC',
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
        attributionText: 'NASA Official: Stephen Berrick',
        displayVersion: true,
        primaryLinks: [{
          href: 'http://www.nasa.gov/FOIA/index.html',
          title: 'FOIA'
        }, {
          href: 'http://www.nasa.gov/about/highlights/HP_Privacy.html',
          title: 'NASA Privacy Policy'
        }, {
          href: 'http://www.usa.gov',
          title: 'USA.gov'
        }],
        secondaryLinks: [{
          href: 'https://access.earthdata.nasa.gov/',
          title: 'Earthdata Access: A Section 508 accessible alternative'
        }]
      },
      hasLogo: false,
      hasScripts: false,
      hasStyles: false,
      logo: {},
      pageTitle: 'Example',
      portalBrowser: false,
      portalId: 'example',
      query: {
        echoCollectionId: 'C203234523-LAADS'
      },
      title: {
        primary: 'Example'
      },
      ui: {
        showNonEosdisCheckbox: true,
        showOnlyGranulesCheckbox: true,
        showTophat: true
      }
    }

    // mock store for available collections in EDSC
    const mockAvailablePortals = {
      availablePortals: { example: payload, edsc: parentPayload }
    }

    // mockStore with initialState
    const store = mockStore(mockAvailablePortals)

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
