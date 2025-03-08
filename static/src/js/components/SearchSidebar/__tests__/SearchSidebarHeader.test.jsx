import React from 'react'
import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'

import SearchSidebarHeader from '../SearchSidebarHeader'
import SearchFormContainer from '../../../containers/SearchFormContainer/SearchFormContainer'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

import availablePortals from '../../../../../../portals/availablePortals.json'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

jest.mock('../../../containers/SearchFormContainer/SearchFormContainer', () => jest.fn(({ children }) => (
  <mock-SearchFormContainer data-testid="SearchFormContainer">
    {children}
  </mock-SearchFormContainer>
)))

jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => jest.fn(({ children }) => (
  <mock-PortalLinkContainer data-testid="PortalLinkContainer">
    {children}
  </mock-PortalLinkContainer>
)))

// Use virtual mocks of modules that don't exist anywhere in the system
jest.mock('../../../../../../portals/testPortal/images/logo.png', () => ('testPortal_logo_path'), { virtual: true })
jest.mock('../../../../../../portals/testPortal2/images/logo.png', () => ('testPortal2_logo_path'), { virtual: true })

jest.mock('../../../../../../portals/availablePortals.json', () => ({
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
      hasGranulesOrCwic: null,
      project: 'testProject'
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

function setup(overrideProps) {
  const props = {
    portal: availablePortals.edsc,
    location: {
      pathname: '/search',
      search: ''
    },
    ...overrideProps
  }

  render(<SearchSidebarHeader {...props} />)
}

beforeEach(() => {
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    defaultPortal: 'edsc'
  }))
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SearchSidebarHeader component', () => {
  test('renders the SearchFormContainer', () => {
    setup()

    expect(SearchFormContainer).toHaveBeenCalledTimes(1)
  })

  describe('when a portal is loaded', () => {
    test('renders the Leave Portal link', async () => {
      setup({
        portal: availablePortals.testPortal,
        location: {
          pathname: '/search',
          search: '?portal=testPortal'
        }
      })

      await waitFor(() => {
        expect(PortalLinkContainer).toHaveBeenCalledTimes(1)
      })

      expect(PortalLinkContainer).toHaveBeenCalledWith(expect.objectContaining({
        children: 'Leave Portal',
        newPortal: {},
        title: 'Leave Portal',
        to: {
          pathname: '/search',
          search: '?portal=testPortal'
        },
        updatePath: true
      }), {})
    })

    test('renders the portal logo and removes the spinner', async () => {
      setup({
        portal: availablePortals.testPortal2,
        location: {
          pathname: '/search',
          search: '?portal=testPortal2'
        }
      })

      let image

      await waitFor(() => {
        image = screen.getByTestId('portal-logo')
        expect(image).toBeDefined()
      })

      fireEvent.load(image)

      expect(screen.queryByTestId('portal-logo-spinner')).not.toBeInTheDocument()

      expect(screen.getByTestId('portal-logo')).toHaveAttribute('src', 'testPortal2_logo_path')
      expect(screen.getByTestId('portal-logo')).toHaveClass('search-sidebar-header__thumbnail--is-loaded')
    })

    test('renders the portal logo with a moreInfoUrl', async () => {
      setup({
        portal: availablePortals.testPortal,
        location: {
          pathname: '/search',
          search: '?portal=testPortal'
        }
      })

      await waitFor(() => {
        expect(screen.getByTestId('portal-logo-link').href).toEqual('https://test.gov/')
      })
    })
  })
})
