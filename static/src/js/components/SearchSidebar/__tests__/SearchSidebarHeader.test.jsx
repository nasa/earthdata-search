import React from 'react'
import {
  fireEvent,
  screen,
  waitFor
} from '@testing-library/react'
import { useLocation } from 'react-router-dom'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import SearchSidebarHeader from '../SearchSidebarHeader'
import SearchForm from '../../SearchForm/SearchForm'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

// References portals/__mocks__/availablePortals.json in test
import availablePortals from '../../../../../../portals/availablePortals.json'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

vi.mock('../../SearchForm/SearchForm', () => ({
  default: vi.fn(({ children }) => (
    <div>
      {children}
    </div>
  ))
}))

vi.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => ({
  default: vi.fn(({ children }) => (
    <div>
      {children}
    </div>
  ))
}))

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')), // Preserve other exports
  useLocation: vi.fn().mockReturnValue({
    pathname: '/search',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

const setup = setupTest({
  Component: SearchSidebarHeader,
  defaultZustandState: {
    portal: availablePortals.edsc
  }
})

beforeEach(() => {
  vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    defaultPortal: 'edsc'
  }))
})

describe('SearchSidebarHeader component', () => {
  test('renders the SearchForm', async () => {
    setup()

    await waitFor(() => {
      expect(SearchForm).toHaveBeenCalledTimes(1)
    })

    expect(SearchForm).toHaveBeenCalledWith({}, {})
  })

  describe('when a portal is loaded', () => {
    test('renders the Leave Portal link', async () => {
      useLocation.mockReturnValue({
        pathname: '/search',
        search: '?portal=above'
      })

      setup({
        overrideZustandState: {
          portal: availablePortals.above
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
          search: '?portal=above'
        },
        updatePath: true
      }), {})
    })

    test('renders the portal logo and removes the spinner', async () => {
      useLocation.mockReturnValue({
        pathname: '/search',
        search: '?portal=above'
      })

      setup({
        overrideZustandState: {
          portal: availablePortals.above
        }
      })

      let image

      await waitFor(() => {
        image = screen.getByTestId('portal-logo')
        expect(image).toBeDefined()
      })

      fireEvent.load(image)

      expect(screen.queryByTestId('portal-logo-spinner')).not.toBeInTheDocument()

      // Mocking this src isn't working reliably, so just check that it contains the imagetools path
      expect(await screen.findByTestId('portal-logo')).toHaveAttribute('src', expect.stringContaining('/@imagetools/'))

      expect(screen.getByTestId('portal-logo')).toHaveClass('search-sidebar-header__thumbnail--is-loaded')
    })

    test('renders the portal logo with a moreInfoUrl', async () => {
      useLocation.mockReturnValue({
        pathname: '/search',
        search: '?portal=above'
      })

      setup({
        overrideZustandState: {
          portal: availablePortals.above
        }
      })

      await waitFor(() => {
        expect(screen.getByTestId('portal-logo-link').href).toEqual('https://test.gov/')
      })
    })
  })
})
