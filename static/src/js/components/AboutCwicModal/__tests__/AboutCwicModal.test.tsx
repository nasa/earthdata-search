import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AboutCwicModal from '../AboutCwicModal'

function setup(overrideProps = {}) {
  const user = userEvent.setup()
  const onToggleAboutCwicModal = jest.fn()

  const props = {
    isOpen: true,
    onToggleAboutCwicModal,
    ...overrideProps
  }

  render(<AboutCwicModal {...props} />)

  return {
    onToggleAboutCwicModal,
    user
  }
}

describe('AboutCwicModal component', () => {
  test('should render a Modal', () => {
    setup()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  test('should render a title', () => {
    setup()

    expect(screen.getByText("What's Int'l / Interagency Data")).toBeInTheDocument()
  })

  test('should render the body', () => {
    setup()

    expect(screen.getByText(/This collection uses external services to find granules through a system called CWIC/)).toBeInTheDocument()
  })

  test('should call onToggleAboutCwicModal when the modal is closed', async () => {
    const { onToggleAboutCwicModal, user } = setup()

    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    expect(onToggleAboutCwicModal).toHaveBeenCalledWith(false)
  })
})
