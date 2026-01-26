import React from 'react'
import { screen } from '@testing-library/react'

import HomePortalCard from '../HomePortalCard'
import setupTest from '../../../../../../vitestConfigs/setupTest'

const assignMock = vi.fn()

vi.spyOn(window, 'location', 'get').mockReturnValue({
  ...window.location,
  assign: assignMock // Mock assign to prevent navigation errors
})

vi.mock('../../../hooks/usePortalLogo', () => ({
  usePortalLogo: vi.fn(() => 'mock-logo-src')
}))

vi.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => {
  const MockPortalLinkContainer = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
  MockPortalLinkContainer.displayName = 'MockPortalLinkContainer'

  return { default: MockPortalLinkContainer }
})

const setup = setupTest({
  Component: HomePortalCard,
  defaultProps: {
    portalId: 'test-portal',
    title: {
      primary: 'Test Portal',
      secondary: 'Subtitle'
    },
    moreInfoUrl: 'https://example.com'
  }
})

describe('HomePortalCard', () => {
  test('renders the portal card with the correct title and subtitle', () => {
    setup()

    expect(screen.getByText('Test Portal')).toBeInTheDocument()
    expect(screen.getByText('Subtitle')).toBeInTheDocument()
  })

  test('renders the portal logo with the correct alt text', () => {
    setup()

    const logo = screen.getByAltText('A logo for Test Portal (Subtitle)')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', 'mock-logo-src')
  })

  test('renders the "More Info" link when moreInfoUrl is provided', () => {
    setup()

    const moreInfoLink = screen.getByText('More Info')
    expect(moreInfoLink).toBeInTheDocument()
    expect(moreInfoLink).toHaveAttribute('href', 'https://example.com')
  })

  test('does not render the "More Info" link when moreInfoUrl is not provided', () => {
    setup({
      overrideProps: {
        moreInfoUrl: undefined
      }
    })

    expect(screen.queryByText('More Info')).not.toBeInTheDocument()
  })

  test('stops propagation when the "More Info" link is clicked', async () => {
    const stopPropagationMock = vi.fn()

    setup()

    const moreInfoLink = screen.getByText('More Info')

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    })
    event.stopPropagation = stopPropagationMock

    moreInfoLink.dispatchEvent(event)

    expect(stopPropagationMock).toHaveBeenCalledTimes(1)
  })
})
