import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { PortalList } from '../PortalList'

describe('PortalList component', () => {
  test('renders a list of portals', () => {
    const portals = {
      mockPortal: {
        description: 'mock description',
        hasLogo: true,
        portalBrowser: true,
        portalId: 'mockPortal',
        moreInfoUrl: 'http://example.com',
        title: {
          primary: 'Example Portal',
          secondary: 'Just an example'
        }
      }
    }
    render(
      <PortalList
        portals={portals}
      />
    )

    expect(screen.getByTestId('portal-title-mockPortal')).toHaveTextContent('Example Portal(Just an example)')
    expect(screen.getByTestId('portal-description-mockPortal')).toHaveTextContent('mock description')
    expect(screen.getByTestId('portal-link-mockPortal').querySelector('a')).toHaveAttribute('href', 'http://example.com')
  })

  test('renders a portal without an image', () => {
    const portals = {
      mockPortal: {
        description: 'mock description',
        hasLogo: false,
        portalBrowser: true,
        portalId: 'mockPortal',
        moreInfoUrl: 'http://example.com',
        title: {
          primary: 'Example Portal',
          secondary: 'Just an example'
        }
      }
    }
    render(
      <PortalList
        portals={portals}
      />
    )

    expect(screen.getByTestId('portal-title-mockPortal')).toHaveTextContent('Example Portal(Just an example)')
    expect(screen.getByTestId('portal-description-mockPortal')).toHaveTextContent('mock description')
    expect(screen.getByTestId('portal-link-mockPortal').querySelector('a')).toHaveAttribute('href', 'http://example.com')
  })

  test('does not render a portal that is excluded from the browser', () => {
    const portals = {
      mockPortal: {
        description: 'mock description',
        hasLogo: false,
        portalBrowser: false,
        portalId: 'mockPortal',
        moreInfoUrl: 'http://example.com',
        title: {
          primary: 'Example Portal',
          secondary: 'Just an example'
        }
      }
    }
    render(
      <PortalList
        portals={portals}
      />
    )

    expect(screen.queryByTestId('portal-title-mockPortal')).toBeNull()
    expect(screen.queryByTestId('portal-description-mockPortal')).toBeNull()
    expect(screen.queryByTestId('portal-link-mockPortal')).toBeNull()
  })

  test('clicking on the portal opens the portal', async () => {
    const user = userEvent.setup()

    delete window.location
    window.location = { replace: jest.fn() }

    const portals = {
      mockPortal: {
        description: 'mock description',
        hasLogo: false,
        portalBrowser: true,
        portalId: 'mockPortal',
        moreInfoUrl: 'http://example.com',
        title: {
          primary: 'Example Portal',
          secondary: 'Just an example'
        }
      }
    }
    render(
      <PortalList
        portals={portals}
      />
    )

    const portalTitle = screen.queryByTestId('portal-list-item-mockPortal')
    await user.click(portalTitle)

    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith('/portal/mockPortal')
  })

  test('using keyUp on the portal opens the portal', async () => {
    const user = userEvent.setup()

    delete window.location
    window.location = { replace: jest.fn() }

    const portals = {
      mockPortal: {
        description: 'mock description',
        hasLogo: false,
        portalBrowser: true,
        portalId: 'mockPortal',
        moreInfoUrl: 'http://example.com',
        title: {
          primary: 'Example Portal',
          secondary: 'Just an example'
        }
      }
    }
    render(
      <PortalList
        portals={portals}
      />
    )

    // Focus on the list item, then press `enter`
    screen.queryByTestId('portal-list-item-mockPortal').focus()
    await user.keyboard('{enter}')

    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith('/portal/mockPortal')
  })

  test('clicking on the `More Info` does not open the portal', async () => {
    const user = userEvent.setup()

    delete window.location
    window.location = { replace: jest.fn() }

    const portals = {
      mockPortal: {
        description: 'mock description',
        hasLogo: false,
        portalBrowser: true,
        portalId: 'mockPortal',
        moreInfoUrl: 'http://example.com',
        title: {
          primary: 'Example Portal',
          secondary: 'Just an example'
        }
      }
    }
    render(
      <PortalList
        portals={portals}
      />
    )

    const moreInfoLink = screen.getByTestId('portal-link-mockPortal').querySelector('a')
    await user.click(moreInfoLink)

    expect(window.location.replace).toHaveBeenCalledTimes(0)
  })
})
