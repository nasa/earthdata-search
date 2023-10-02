import React from 'react'
import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import '@testing-library/jest-dom'

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

jest.mock('../../../../../../portals/idn/images/logo.png', () => ('idn_logo_path'))
jest.mock('../../../../../../portals/soos/images/logo.png', () => ('soos_logo_path'))

import SearchSidebarHeader from '../SearchSidebarHeader'
import SearchFormContainer from '../../../containers/SearchFormContainer/SearchFormContainer'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

import { availablePortals } from '../../../../../../portals'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

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
        portal: availablePortals.idn,
        location: {
          pathname: '/search',
          search: '?portal=idn'
        }
      })

      await waitFor(() => {
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
    })

    test('renders the portal logo and removes the spinner', async () => {
      setup({
        portal: availablePortals.soos,
        location: {
          pathname: '/search',
          search: '?portal=soos'
        }
      })

      await waitFor(() => {
        const image = screen.getByTestId('portal-logo')
        expect(image).toBeDefined()

        fireEvent.load(image)

        expect(screen.queryByTestId('portal-logo-spinner')).not.toBeInTheDocument()

        expect(screen.getByTestId('portal-logo')).toHaveAttribute('src', 'soos_logo_path')
        expect(screen.getByTestId('portal-logo')).toHaveClass('search-sidebar-header__thumbnail--is-loaded')
      })
    })

    test('renders the portal logo with a moreInfoUrl', async () => {
      setup({
        portal: availablePortals.idn,
        location: {
          pathname: '/search',
          search: '?portal=idn'
        }
      })

      await waitFor(() => {
        expect(screen.getByTestId('portal-logo-link').href).toEqual('https://idn.ceos.org/')
      })
    })
  })
})
