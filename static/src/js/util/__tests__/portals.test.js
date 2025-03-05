import { buildConfig, isDefaultPortal } from '../portals'
import * as getApplicationConfig from '../../../../../sharedUtils/config'

// eslint-disable-next-line import/no-unresolved
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
  idn: {
    moreInfoUrl: 'https://ceos.org/ourwork/workinggroups/wgiss/access/international-directory-network/',
    pageTitle: 'IDN',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      hasGranulesOrCwic: null
    },
    title: {
      primary: 'IDN',
      secondary: 'CEOS International Directory Network'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'idn'
  },
  soos: {
    moreInfoUrl: 'http://www.soos.aq',
    pageTitle: 'Southern Ocean Observing System',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      hasGranulesOrCwic: null,
      tagKey: []
    },
    title: {
      primary: 'SOOS',
      secondary: 'Southern Ocean Observing System'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'soos'
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
    const config = buildConfig(availablePortals.idn)

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
      moreInfoUrl: 'https://ceos.org/ourwork/workinggroups/wgiss/access/international-directory-network/',
      pageTitle: 'IDN',
      portalBrowser: true,
      portalId: 'idn',
      query: { hasGranulesOrCwic: null },
      title: {
        primary: 'IDN',
        secondary: 'CEOS International Directory Network'
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
