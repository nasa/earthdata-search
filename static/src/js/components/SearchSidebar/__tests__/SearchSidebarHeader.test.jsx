import React from 'react'
import {
  fireEvent,
  screen,
  waitFor
} from '@testing-library/react'
import { useLocation } from 'react-router-dom'

import setupTest from '../../../../../../jestConfigs/setupTest'

import SearchSidebarHeader from '../SearchSidebarHeader'
import SearchForm from '../../SearchForm/SearchForm'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

// References portals/__mocks__/availablePortals.json in test
import availablePortals from '../../../../../../portals/availablePortals.json'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

jest.mock('../../SearchForm/SearchForm', () => jest.fn(({ children }) => (
  <div>
    {children}
  </div>
)))

jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => jest.fn(({ children }) => (
  <div>
    {children}
  </div>
)))

// Use virtual mocks of modules that don't exist anywhere in the system
jest.mock('../../../../../../portals/testPortal/images/logo.png?h=56&format=webp', () => ('testPortal_logo_path'), { virtual: true })
jest.mock('../../../../../../portals/testPortal2/images/logo.png?h=56&format=webp', () => ('testPortal2_logo_path'), { virtual: true })

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useLocation: jest.fn().mockReturnValue({
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
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
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
        search: '?portal=testPortal'
      })

      setup({
        overrideZustandState: {
          portal: availablePortals.testPortal
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
      useLocation.mockReturnValue({
        pathname: '/search',
        search: '?portal=testPortal'
      })

      setup({
        overrideZustandState: {
          portal: availablePortals.testPortal2
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
      useLocation.mockReturnValue({
        pathname: '/search',
        search: '?portal=testPortal'
      })

      setup({
        overrideZustandState: {
          portal: availablePortals.testPortal
        }
      })

      await waitFor(() => {
        expect(screen.getByTestId('portal-logo-link').href).toEqual('https://test.gov/')
      })
    })
  })
})
