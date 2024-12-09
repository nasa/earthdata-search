import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('../PortalList', () => ({
  PortalList: jest.fn(({ children }) => (
    <mock-PortalList data-testid="PortalList">
      {children}
    </mock-PortalList>
  ))
}))

import { PortalBrowserModal } from '../PortalBrowserModal'
import { PortalList } from '../PortalList'

describe('PortalBrowserModal component', () => {
  test('renders a PortalList component', () => {
    const isOpen = true
    const location = {
      pathname: '/search'
    }
    const onTogglePortalBrowserModal = jest.fn()
    render(
      <PortalBrowserModal
        isOpen={isOpen}
        location={location}
        onTogglePortalBrowserModal={onTogglePortalBrowserModal}
      />
    )

    expect(PortalList).toHaveBeenCalledTimes(1)
    expect(PortalList).toHaveBeenCalledWith(expect.objectContaining({ location }), {})
  })

  test('closing the portal works', async () => {
    const user = userEvent.setup()

    const isOpen = true
    const location = {
      pathname: '/search'
    }
    const onTogglePortalBrowserModal = jest.fn()
    render(
      <PortalBrowserModal
        isOpen={isOpen}
        location={location}
        onTogglePortalBrowserModal={onTogglePortalBrowserModal}
      />
    )

    const closeModalButton = screen.getByRole('button', { name: 'Close EDSCModal' })
    await user.click(closeModalButton)

    expect(onTogglePortalBrowserModal).toHaveBeenCalledTimes(1)
    expect(onTogglePortalBrowserModal).toHaveBeenCalledWith(false)
  })
})
