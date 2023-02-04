import { getPortalConfig, isDefaultPortal } from '../portals'
import * as getApplicationConfig from '../../../../../sharedUtils/config'

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

describe('getPortalConfig', () => {
  test('builds a portal config of portal > edsc portal > default portal', () => {
    const config = getPortalConfig('idn')

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
      hasStyles: true,
      logo: {
        id: 'idn-logo',
        link: 'https://idn.ceos.org/',
        title: 'CEOS IDN Search'
      },
      org: 'IDN',
      pageTitle: 'IDN',
      query: { hasGranulesOrCwic: null },
      title: 'Search',
      ui: {
        showOnlyGranulesCheckbox: false,
        showNonEosdisCheckbox: false,
        showTophat: true
      },
      parentConfig: 'edsc'
    })
  })
})
