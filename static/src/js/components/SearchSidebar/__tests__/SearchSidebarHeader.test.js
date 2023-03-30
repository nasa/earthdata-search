import React from 'react'
import { render, screen } from '@testing-library/react'

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

import SearchSidebarHeader from '../SearchSidebarHeader'
import SearchFormContainer from '../../../containers/SearchFormContainer/SearchFormContainer'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

import { availablePortals } from '../../../../../../portals'

function setup(overrideProps) {
  const props = {
    portal: {
      title: {
        primary: 'Earthdata Search'
      },
      hasLogo: false,
      moreInfoUrl: null,
      portalId: 'edsc'
    },
    location: {
      pathname: '/search',
      search: ''
    },
    ...overrideProps
  }

  render(<SearchSidebarHeader {...props} />)
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('SearchSidebarHeader component', () => {
  test('renders the SearchFormContainer', () => {
    setup()

    expect(SearchFormContainer).toHaveBeenCalledTimes(1)
  })

  describe('when a portal is loaded', () => {
    test('renders the Leave Portal link', () => {
      setup({
        portal: availablePortals.idn,
        location: {
          pathname: '/search',
          search: '?portal=idn'
        }
      })

      expect(PortalLinkContainer).toHaveBeenCalledTimes(1)
      expect(PortalLinkContainer).toHaveBeenCalledWith(expect.objectContaining({
        children: 'Leave Portal',
        newPortal: {},
        title: 'Leave Portal',
        to: {
          pathname: '/search',
          search: '?portal=idn'
        },
        updatePath: true
      }), {})
    })

    test('renders the portal logo', () => {
      setup({
        portal: availablePortals.idn,
        location: {
          pathname: '/search',
          search: '?portal=idn'
        }
      })

      expect(screen.getByTestId('portal-logo')).toBeDefined()
    })

    test('renders the portal logo with a moreInfoUrl', () => {
      setup({
        portal: availablePortals.idn,
        location: {
          pathname: '/search',
          search: '?portal=idn'
        }
      })

      expect(screen.getByTestId('portal-logo-link').href).toEqual('https://idn.ceos.org/')
    })
  })
})
