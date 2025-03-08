import { buildConfig, isDefaultPortal } from '../portals'
import * as getApplicationConfig from '../../../../../sharedUtils/config'

import availablePortals from '../../../../../portals/availablePortals.json'

jest.mock('../../../../../portals/availablePortals.json', () => ({
  edsc: {
    features: {
      advancedSearch: true,
      authentication: true,
      featureFacets:
        {
          showAvailableInEarthdataCloud: true,
          showCustomizable: true,
          showMapImagery: true
        }

    },
    footer: {
      attributionText: 'NASA Official: Test Official',
      displayVersion: true,
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
    pageTitle: 'Earthdata Search',
    portalBrowser: false,
    title: {
      primary: 'Earthdata Search'
    },
    ui: {
      showNonEosdisCheckbox: true,
      showOnlyGranulesCheckbox: true,
      showTophat: true
    },
    portalId: 'edsc'
  },
  testPortal: {
    moreInfoUrl: 'https://test.gov',
    pageTitle: 'TEST',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      hasGranulesOrCwic: null
    },
    title: {
      primary: 'test',
      secondary: 'test secondary title'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'testPortal'
  },
  testPortal2: {
    moreInfoUrl: 'https://test2.org',
    pageTitle: 'TEST2',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      hasGranulesOrCwic: null
    },
    title: {
      primary: 'testPortal2',
      secondary: 'test secondary title'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'testPortal2'
  }
}
))

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('isDefaultPortal', () => {
  beforeEach(() => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      defaultPortal: 'edsc'
    }))
  })

  test('returns true if the portalId matches the defaultPortal', () => {
    expect(isDefaultPortal('edsc')).toBeTruthy()
  })

  test('returns false if the portalId does not match the defaultPortal', () => {
    expect(isDefaultPortal('simple')).toBeFalsy()
  })
})

describe('buildConfig', () => {
  test('builds a portal config of portal > edsc portal > default portal', () => {
    const config = buildConfig(availablePortals.testPortal)

    expect(config).toEqual({
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
        attributionText: 'NASA Official: Test Official',
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
      moreInfoUrl: 'https://test.gov',
      pageTitle: 'TEST',
      portalBrowser: true,
      portalId: 'testPortal',
      query: { hasGranulesOrCwic: null },
      title: {
        primary: 'test',
        secondary: 'test secondary title'
      },
      ui: {
        showOnlyGranulesCheckbox: false,
        showNonEosdisCheckbox: false,
        showTophat: true
      },
      parentConfig: 'edsc'
    })
  })
})
